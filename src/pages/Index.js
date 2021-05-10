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
    <>
      {accessToken === undefined || accessToken === null ? (
        <WoLogin />
      ) : (
        <WLogin />
      )}
    </>
  );
}

function WoLogin() {
  return (
    <section class="jumbotron text-center bg-white">
      <div class="container">
        <h1 class="jumbotron-heading">Welcome to BitClass™</h1>
        <p class="lead text-muted">
          Something short and leading about the collection below—its contents,
          the creator, etc. Make it short and sweet, but not too short so folks
          don't simply skip over it entirely.
        </p>
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
    return () => { };
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
    return () => {
    }
  }, [])

  async function loadUserDetail() {
    console.log("useEffect");
    const accessToken = window.localStorage.getItem("token")
    if(!(accessToken === undefined || accessToken === null)){
      console.log(accessToken);
      let user = await API.getUserDetail();
      setName(user.name);
    }
  }

  return (
    <div className="container pt-4">
      <div className="row">
        <h2 className="mr-auto" >Welcome, {name} </h2>
      </div>
      <div className="row">
        <h6 className="mr-auto" style={{color:"#404040"}}>Study from anywhere with bitclass</h6>
      </div>
      <div className="row">
        <h4 className="mr-auto" style={{color:"#404040"}}>Your Class</h4>
        <Button
          className="mr-2"
          variant="success"
          onClick={() => setCreateModalShow(true)}
        >
          Create Class
        </Button>
        <Button onClick={() => setJoinModalShow(true)} variant="primary" >Join Class</Button>
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
          <div class="mx-auto mt-5 " style={{color:"#404040"}}><Spinner animation="grow" role="status" size="sm" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>  Loading...</div>
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
                  <div class="card-body">
                    <p class="card-text">{classroom.name}</p>
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
