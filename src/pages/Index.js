import { useAppContext, useDispatchContext } from "../state/auth";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useState } from "react";
import API from "../services/api";
import Swal from "sweetalert2";
import logo from "../classroom.jpg";
export default function Home() {
  const { accessToken } = useAppContext();

  return (
    <div style={{ backgroundColor: "#fef8ec" }}>
      {accessToken === undefined || accessToken === null ? (
        <WoLogin />
      ) : (
        <WLogin />
      )}
    </div>
  );
}

function WoLogin() {
  return (
    <section
      class="jumbotron text-center"
      style={{ backgroundColor: "#fef8ec" }}
    >
      <div class="container">
        <h1 class="jumbotron-heading">Welcome to BitClass™</h1>
        <p class="lead text-muted">
          BitClass™ is an web application that allows teacher and student to
          host a class with feature such as posting feed and upload file while
          all the in-class data is keep between client and no private data store
          on the server. By using Peer-to-Peer, all the data will trasfer
          directly to each client so no worry that we can collect your data.
        </p>
        <p class="lead text-muted">Protected your privacy by BitClass™</p>
      </div>
    </section>
  );
}

function WLogin() {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [joinModalShow, setJoinModalShow] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    init();
    return () => {};
  }, []);
  async function init() {
    var userInfo = await API.getUserDetail();
    // console.log(userInfo);
    var classesInfo = await API.getClassesDetail(userInfo.classes);
    console.log(classesInfo);
    setClasses(classesInfo);
    setLoading(false);
  }

  useEffect(() => {
    loadUserDetail();
    return () => {};
  }, []);

  async function loadUserDetail() {
    console.log("useEffect");
    const accessToken = window.localStorage.getItem("token");
    if (!(accessToken === undefined || accessToken === null)) {
      console.log(accessToken);
      let user = await API.getUserDetail();
      setName(user.name);
    }
  }

  return (
    <div className="container pt-4">
      <div className="row">
        <h3 className="mr-auto">
          <span style={{ color: "grey", fontWeight: "400" }}>Welcome,</span>{" "}
          <span style={{ fontWeight: "600" }}>{name} </span>
        </h3>
      </div>
      <div className="row">
        <h6
          className="mr-auto"
          style={{ color: "rgb(156 156 156)", fontWeight: "500" }}
        >
          Study from anywhere with bitclass
        </h6>
      </div>
      <div className="row pb-4">
        <Button
          className="mr-2 ml-auto"
          variant="success"
          onClick={() => setCreateModalShow(true)}
        >
          Create Class
        </Button>
        <Button onClick={() => setJoinModalShow(true)} variant="primary">
          Join Class
        </Button>
        <CreateClassModal
          backdrop="static"
          show={createModalShow}
          onHide={() => setCreateModalShow(false)}
        />
        <JoinClassModal
          backdrop="static"
          show={joinModalShow}
          onHide={() => setJoinModalShow(false)}
        />
      </div>
      <div className="row">
        {loading ? (
          <div class="mx-auto mt-5 " style={{ color: "#404040" }}>
            <Spinner animation="grow" role="status" size="sm" variant="primary">
              <span className="sr-only">Loading...</span>
            </Spinner>{" "}
            Loading...
          </div>
        ) : classes.length === 0 ? (
          <div className="mx-auto mt-5">
            <Button
              className="mr-2 ml-auto"
              variant="success"
              onClick={() => setCreateModalShow(true)}
            >
              Create Class
            </Button>
            or &nbsp;
            <Button onClick={() => setJoinModalShow(true)} variant="primary">
              Join Class
            </Button>{" "}
            &nbsp; to start using BitClass™
          </div>
        ) : (
          classes.map((classroom) => (
            <div key={classroom.cid} class="col-md-4">
              <Link to={`/class/${classroom.cid}`}>
                <div class="card mb-4 box-shadow">
                  <img
                    class="card-img-top"
                    data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
                    alt="Thumbnail [100%x225]"
                    style={{ height: "225px", width: "100%", display: "block" }}
                    src={logo}
                    data-holder-rendered="true"
                  />
                  <div
                    class="card-body"
                    style={{ "background-color": "white" }}
                  >
                    <p class="card-text text-dark">{classroom.name}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );

  function CreateClassModal(props) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [section, setSection] = useState(1);

    async function createClass() {
      // console.log(name+code+section);
      try {
        let res = await API.createClass(name, code, section);
        // console.log(res);
        if (res.status === 200) {
          window.location.href = `/class/${res.data}`;
        } else {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      } catch (error) {
        Swal.fire("Oops...", "Something went wrong!", "error");
      }
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Form.Group>
            <Form.Group controlId="formCode">
              <Form.Label>Class Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
                onChange={(e) => setCode(e.target.value)}
                value={code}
              />
            </Form.Group>
            <Form.Group controlId="formSection">
              <Form.Label>Class Section</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter section"
                onChange={(e) => setSection(e.target.value)}
                value={section}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>

          <Button onClick={createClass} variant="success" type="submit">
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function JoinClassModal(props) {
    const [cid, setCid] = useState("");

    async function joinClass() {
      // console.log(name+code+section);
      try {
        let res = await API.joinClass(cid);
        // console.log(res);
        if (res.status === 200) {
          window.location.href = `/class/${res.data}`;
        } else {
          Swal.fire("Oops...", "Something went wrong!", "error");
        }
      } catch (error) {
        Swal.fire("Oops...", "Something went wrong!", "error");
      }
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Join Class by CID
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Class CID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter CID"
                onChange={(e) => setCid(e.target.value)}
                value={cid}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>

          <Button onClick={joinClass} variant="success" type="submit">
            Join
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
