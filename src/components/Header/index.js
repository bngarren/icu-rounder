import MyDocument from "../MyDocument";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { sortByBed } from "../../utils/Utility";

import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import ViewListIcon from "@material-ui/icons/ViewList";
import SettingsIcon from "@material-ui/icons/Settings";

import { useLocation } from "wouter";

import { useSettings } from "../../context/Settings";

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: "black",
  },
  toolbarRoot: {},
  toolbarButtonsDiv: {},
  toolbarTitleDiv: {
    display: "flex",
    flexDirection: "row",
  },
  iconButtonDownload: {
    color: "rgba(223, 255, 0, 0.82)",
  },
  iconButtonEdit: {
    color: "rgba(223, 255, 0, 0.82)",
  },
  iconButtonSettings: {
    color: "rgba(223, 255, 0, 0.82)",
  },
}));

const Header = () => {
  const classes = useStyles();
  const [location, setLocation] = useLocation();
  const { settings, dispatchSettings } = useSettings();

  const getPdf = async () => {
    const localData = JSON.parse(localStorage.getItem("gridData"));
    let arr = [];
    for (let i in localData) {
      arr.push(localData[i]);
    }
    const arraySortedByBed = sortByBed(arr);
    const blob = await pdf(
      <MyDocument
        beds={30}
        title={settings.document_title}
        colsPerPage={settings.document_cols_per_page}
        data={arraySortedByBed}
      />
    ).toBlob();
    saveAs(blob, "grid.pdf");
  };

  return (
    <div>
      <AppBar className={classes.navbar}>
        <Toolbar variant="dense" className={classes.toolbarRoot}>
          <div className={classes.toolbarTitleDiv}>
            <Typography variant="h6" style={{ marginRight: "3px" }}>
              Griddy
            </Typography>
            <Typography variant="overline">alpha</Typography>
          </div>
          <div className={classes.toolbarButtonsDiv}>
            <Tooltip title="Download PDF">
              <IconButton
                onClick={getPdf}
                className={classes.iconButtonDownload}
              >
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => setLocation("/update")}
                className={classes.iconButtonEdit}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton
                className={classes.iconButtonSettings}
                onClick={() => setLocation("/settings")}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
};

export default Header;
