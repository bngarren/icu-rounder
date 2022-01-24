import "./debug/wdyr";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

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
