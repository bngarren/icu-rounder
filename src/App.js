import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import ViewListIcon from "@material-ui/icons/ViewList";
import "./App.css";
import { Router, useLocation } from "wouter";

// Where all of our pages come from
import PageRouter from "./components/PageRouter";
import useHashLocation from "./hooks/wouter-hash";

const useStyles = makeStyles((theme) => ({}));

function App() {
  const classes = useStyles();
  const [location, setLocation] = useLocation();

  return (
    <Router>
      <div className="app">
        <AppBar>
          <Toolbar variant="dense">
            <IconButton onClick={() => setLocation("/document")}>
              <DescriptionIcon />
            </IconButton>
            <IconButton onClick={() => setLocation("/update")}>
              <ViewListIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <PageRouter />
      </div>
    </Router>
  );
}

export default App;
