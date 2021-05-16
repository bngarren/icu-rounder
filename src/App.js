import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Tooltip } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import ViewListIcon from "@material-ui/icons/ViewList";
import "./App.css";
import { Router, useLocation } from "wouter";

import MyDocument from "./components/MyDocument";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import { sortByBed } from "./utils/Utility";

// Where all of our pages come from
import PageRouter from "./components/PageRouter";
import useHashLocation from "./hooks/wouter-hash";

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: "black",
  },
  iconButtonDownload: {
    color: "rgba(223, 255, 0, 0.82)",
  },
  iconButtonEdit: {
    color: "rgba(223, 255, 0, 0.82)",
  },
}));

function App() {
  const classes = useStyles();
  const [location, setLocation] = useLocation();

  const getPdf = async () => {
    const localData = JSON.parse(localStorage.getItem("gridData"));
    let arr = [];
    for (let i in localData) {
      arr.push(localData[i]);
    }
    const arraySortedByBed = sortByBed(arr);
    const blob = await pdf(
      <MyDocument beds={30} colsPerPage={4} data={arraySortedByBed} />
    ).toBlob();
    saveAs(blob, "icu.pdf");
  };

  return (
    <Router>
      <div className="app">
        <AppBar className={classes.navbar}>
          <Toolbar variant="dense">
            <IconButton onClick={getPdf} className={classes.iconButtonDownload}>
              <Tooltip title="Download PDF">
                <DescriptionIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => setLocation("/update")}
              className={classes.iconButtonEdit}
            >
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
