import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import firebase from "firebase";
import { FirebaseConfig } from "./config/firebase_config";
import { AppWrapper } from "./state/auth";

if (!firebase.apps.length) {
  firebase.initializeApp(FirebaseConfig.config);
} else {
  firebase.app(); // if already initialized, use that one
}

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
