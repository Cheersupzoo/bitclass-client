import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Peer from "peerjs";
import { nanoid } from "nanoid";
import { Map } from "immutable";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Storage from "../services/storage";

var clientConnections;

var hostConnection;

var peerId = "000";
var peer;
var user = {};
export default function Class() {
  let { classId } = useParams();
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState({});
  const [tab, setTab] = useState(0); // 0 = Feed; 1 = File; 2 = Detail

  const [peerList, setPeerList] = useState([]);
  const [p2pStatus, setP2PStatus] = useState("");

  const [peerConnectionStatus, setPeerConnectionStatus] = useState(0); // 0 = initializing; 1 = connected; 2 = disonnect; 3 = connected as Host
  const [feeds, setFeeds] = useState(
    Storage.getClassStorage(classId)?.feeds || []
  );
  useEffect(() => {
    init();
    initPeerJS();
    return () => {};
  }, []);
  async function init() {
    console.log(classId);
    var classesInfo = await API.getClassDetail(classId);
    console.log(classesInfo);
    setClassroom(classesInfo);
    setLoading(false);
  }

  async function initPeerJS() {
    clientConnections = Map({});
    const accessToken = window.localStorage.getItem("token");
    setP2PStatus("Initializing");
    if (!(accessToken === undefined || accessToken === null)) {
      console.log("set user");
      user = await API.getUserDetail();
      peerId = user.id;
    }

    peer = new Peer(peerId, {
      host: "bitclass-peerjs.herokuapp.com",
      port: 443,
      path: "/myapp",
      secure: true,
    });

    peer.on("open", (id) => {
      console.log("Connection to signaller establised.");
      console.log(`Assigning id: ${id}`);
      setP2PStatus("Connecting to host");
      hostConnection = peer.connect(classId);
      console.log("connecting");

      updatePeerList();

      hostConnection.on("open", () => {
        console.log(`Connection to ${hostConnection.peer} established.`);
        setPeerConnectionStatus(1); // connected
        setP2PStatus("");
        hostConnection.on("data", (data) => {
          console.log("Recvied data:\n", data);

          if (data.type === "peer") {
            updatePeerList(data.peers);
          }

          updateClassData(data);
        });

        hostConnection.on("close", () => {
          console.log(`Connection to ${hostConnection.peer} is closed.`);

          peer.destroy();
          setPeerConnectionStatus(2);
          // window.reload();
        });
      });
    });

    setupPeerListener();

    peer.on("error", (error) => {
      console.log(error);
      setPeerConnectionStatus(2); // Disconnect
      if (error.message.includes("Could not connect to peer")) {
        setP2PStatus("No host exist. Intialize as host");
        hostPeerSession();
      } else {
        setP2PStatus("Something went wrong. Please, refresh this page.");
      }
    });
  }

  async function hostPeerSession() {
    console.log("Host not init yet");
    peerId = classId;
    peer = new Peer(peerId, {
      host: "bitclass-peerjs.herokuapp.com",
      port: 443,
      path: "/myapp",
      secure: true,
    });

    peer.on("open", (id) => {
      setP2PStatus("");
      console.log("Connection to signaller establised.");
      console.log(`Assigning id: ${id}`);
    });
    setPeerConnectionStatus(3); // connected as Host

    setupPeerListener();
  }

  function setupPeerListener() {
    peer.on("connection", (connection) => {
      console.log(`${connection.peer} attempting to establish connection.`);

      connection.on("open", () => {
        console.log(`Connection to ${connection.peer} established.`);

        clientConnections = clientConnections.set(connection.peer, connection);

        const data = {
          sender: "SYSTEM",
          type: "peer",
          // message: `${connection.peer} joined.`,
        };

        updatePeerList();
        // updateClassData(data);

        broadcast({
          ...data,
          peers: generatePeerList(),
        });

        broadcast({
          type: "feed",
          feeds: Storage.getClassStorage(classId)?.feeds || [],
        });
      });

      connection.on("data", (data) => {
        console.log("Recvied data:\n", data);

        updateClassData(data);

        broadcast({
          ...data,
          peers: generatePeerList(),
        });
      });

      connection.on("close", () => {
        console.log(`Connection to ${connection.peer} is closed.`);
        clientConnections = clientConnections.delete(
          connection.peer.toString()
        );

        const data = {
          sender: "SYSTEM",
          type: "peer",
          // message: `${connection.peer} left.`,
        };

        updatePeerList();
        // updateClassData(data);

        broadcast({
          ...data,
          peers: generatePeerList(),
        });

        // document.getElementById("hostId").innerText = "NOT CONNECTED TO ANYONE";
      });
    });

    peer.on("disconnected", () => {
      console.log("Disconnected from signaller.");
      setPeerConnectionStatus(2); // Disconnect
      setP2PStatus("Disconnected. Refresh this page to restart.");
    });
  }

  function updatePeerList(peerList) {
    setPeerList(peerList ? peerList : generatePeerList());
  }

  function generatePeerList() {
    return clientConnections
      .map((connection) => connection.peer)
      .toList()
      .push(`${peerId} (HOST)`)
      .join(", ");
  }

  function broadcast(data) {
    clientConnections.forEach((connection) => connection.send(data));
  }

  function post(title, detail) {
    console.log("post");
    console.log(user);
    const data = {
      sender: user.id,
      type: "feed",
      feeds: [
        { title: title, detail: detail, owner: user.id },
        ...(feeds || []),
      ],
    };

    if (hostConnection) {
      console.log("SSS" + JSON.stringify(data));
      hostConnection.send(data);
    }

    updateClassData(data);
    // host send
    if (!clientConnections.isEmpty()) {
      broadcast({
        ...data,
        peers: generatePeerList(),
      });
    }

    // document.getElementById("message").innerText = "";
  }

  function updateClassData(data) {
    setFeeds(data.feeds);
    Storage.setClassStorage(classId, { feeds: data.feeds });
  }
  return (
    <div className="container pt-2">
      <div className="row ">
        <div className="ml-auto">
          {peerConnectionStatus === 0
            ? "🟡"
            : peerConnectionStatus === 1
            ? "🟢"
            : peerConnectionStatus === 2
            ? "🔴"
            : "⏺️🟢"}
          {/* {peerList} */}
          <span className="ml-2">{p2pStatus}</span>
        </div>
      </div>
      {loading ? (
        <div>loading</div>
      ) : (
        <>
          <h2>Class {classroom.name}</h2>
          <div className="row pl-3">
            <h5 className="pr-5">{classroom.code}</h5>
            <h6 className="mt-auto" style={{ color: "grey" }}>
              Join Code: {classId}
            </h6>
          </div>
          <ButtonGroup className="mb-4" aria-label="Basic example">
            <Button
              variant={tab === 0 ? "secondary" : "primary"}
              onClick={() => setTab(0)}
            >
              Feed
            </Button>
            <Button
              variant={tab === 1 ? "secondary" : "primary"}
              onClick={() => setTab(1)}
            >
              Files
            </Button>
            <Button
              variant={tab === 2 ? "secondary" : "primary"}
              onClick={() => setTab(2)}
            >
              People
            </Button>
          </ButtonGroup>
        </>
      )}
      {buildTab(tab, classroom, post, feeds)}
    </div>
  );
}

function Owner({ ownerId }) {
  const [ownerName, setOwnerName] = useState("");
  useEffect(() => {
    getOwner()
    return () => {};
  }, []);
  async function getOwner() {
    var owner = await API.getUserDetail(ownerId);
    // console.log("owner");
    // console.log(owner);
    setOwnerName(owner.name)
  }
  return <Card.Subtitle className="mb-2 text-muted" ><span style={{color:"#b9b9b9",fontWeight:"400"}}>by {ownerName}</span></Card.Subtitle>;
}

function Feed({ feeds, post }) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  return (
    <div>
      {feeds ? (
        feeds.map((feed, index) => (
          <Card
            key={index}
            body
            className="mb-3"
            style={{ "background-color": "white" }}
          >
            <Card.Title>{feed.title}</Card.Title>
            <Owner ownerId={feed.owner} />
            <Card.Text>{feed.detail}</Card.Text>
          </Card>
        ))
      ) : (
        <></>
      )}
      <Card body style={{ "background-color": "white" }}>
        <Form style={{ "background-color": "white" }}>
          <Form.Group controlId="formtitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formdetail">
            <Form.Label>Detail</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              onChange={(e) => setDetail(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={() => post(title, detail)}>
            Post
          </Button>
        </Form>
      </Card>
    </div>
  );
}

function File() {
  return <h2>Coming soon</h2>;
}

function Detail({ classroom }) {
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState({});
  const [students, setStudents] = useState([]);
  useEffect(() => {
    init();
    return () => {};
  }, []);
  async function init() {
    var ownerInfo = await API.getUserDetail(classroom.owner);
    setOwner(ownerInfo);
    var studentInfos = [];
    await Promise.all(
      classroom.student.map(async (sid) => {
        var studentInfo = await API.getUserDetail(sid);
        studentInfos.push(studentInfo);
      })
    );
    setStudents(studentInfos);
    setLoading(false);
  }
  return (
    <div>
      {loading ? (
        <div>loading</div>
      ) : (
        <>
          <div style={{ fontSize: "20px" }}>
            <b>Teacher</b>
          </div>
          <div>{owner.name}</div>
          <div style={{ fontSize: "20px" }}>
            <b>Student</b>
          </div>
          {students.map((student) => {
            return <div key={student.id}>{student.name}</div>;
          })}
        </>
      )}
    </div>
  );
}

function buildTab(tab, classroom, post, feeds) {
  switch (tab) {
    case 0:
      return <Feed feeds={feeds} post={post} />;
    case 1:
      return <File />;
    case 2:
      return <Detail classroom={classroom} />;
    default:
      return <Feed />;
  }
}
