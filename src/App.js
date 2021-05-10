import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import { Router, Link } from "wouter";

// Where all of our pages come from
import PageRouter from "./components/PageRouter";
import useHashLocation from "./hooks/wouter-hash";

const useStyles = makeStyles((theme) => ({}));

function App() {
  const classes = useStyles();

  return (
    <Router hook={useHashLocation}>
      <div className="app">
        <PageRouter />
      </div>
    </Router>
  );
}

export default App;
