import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Fonts
import "./fonts/roboto/roboto-v27-latin-regular.woff2";
import "./fonts/roboto/roboto-v27-latin-regular.woff";
import "./fonts/roboto/roboto-v27-latin-700.woff2";
import "./fonts/roboto/roboto-v27-latin-700.woff";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
