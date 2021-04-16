import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Link } from "react-router-dom";
import { SiGoogle } from "react-icons/si";
import firebase from "firebase";
import { useAppContext, useDispatchContext } from "../state/auth";
import API from "../services/api";
import { useState, useEffect } from "react";

export default function Header() {
  const { accessToken } = useAppContext();
  const dispatch = useDispatchContext();
  const [name, setName] = useState("");
  function logout() {
    dispatch({
      type: "LOGOUT",
    });
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

  function firebaseSignin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        console.log(result);
        // @ts-ignore
        // result.additionalUserInfo.profile.email;
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        // @ts-ignore
        var token = credential.idToken;
        // console.log(token)

        var idToken = await firebase.auth().currentUser.getIdToken();
        console.log(idToken);

        try {
          // @ts-ignore
          var res = await API.signin(
            "google",
            idToken,
            result.additionalUserInfo.profile.email,
            result.additionalUserInfo.profile.name
          );
          console.log(res);
          if (!res.data.Authorization) return;
          dispatch({
            type: "LOGIN",
            payload: res.data.Authorization,
          });
          window.location.assign(`/`);
        } catch (error) {}

        // login(res.data.Authorization)
        // console.log(bearertoken);
        // setToken(res.data.Authorization);
        // console.log(bearertoken);
        // The signed-in user info.
        // var user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Login/Signup</Popover.Title>
      <Popover.Content>
        <button
          onClick={firebaseSignin}
          className="text-white bg-danger border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg flex"
        >
          <SiGoogle className="my-auto mr-2 " /> Sign in with Google
        </button>
      </Popover.Content>
    </Popover>
  );

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">BitClass™</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link>
            <Link to="/">Home</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/about">About</Link>
          </Nav.Link>
          {/* <Nav.Link>
            <Link to="/class">Class</Link>
          </Nav.Link> */}
        </Nav>
        <Navbar.Text>
          {!(accessToken === undefined || accessToken === null) ? (
            <>
              <span class="navbar-text pr-2">
              {name}
            </span>
              <Button variant="link" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={popover}
              rootClose={true}
            >
              <Button variant="outline-primary">Login/Signup</Button>
            </OverlayTrigger>
          )}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}
