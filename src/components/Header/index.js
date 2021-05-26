import { cloneElement } from "react";
import MyDocument from "../MyDocument";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
  useScrollTrigger,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import ViewListIcon from "@material-ui/icons/ViewList";
import SettingsIcon from "@material-ui/icons/Settings";

import { useLocation } from "wouter";

import { useSettings } from "../../context/Settings";

import { useGridStateContext } from "../../context/GridState";

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: "white",
    borderBottom: "1px solid #e8e7e7a6",
  },
  toolbarRoot: {
    justifyContent: "center",
  },
  toolbarButtonsDiv: {
    display: "flex",
    justifyContent: "center",
  },
  toolbarTitleDiv: {
    display: "flex",
    flexDirection: "row",
    color: "black",
    paddingRight: "15px",
  },
  iconButtonDownloadRoot: {
    "&:hover": {
      backgroundColor: "#00a90b08",
    },
  },
  iconButtonDownload: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
  iconButtonOtherRoot: {
    "&:hover": {
      backgroundColor: "#00a90b08",
    },
  },
  iconButtonOther: {
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.secondary.light,
    },
  },
}));

/* Used to make the App Bar add elevation when the page is scrolled */
const ElevationScroll = ({ children }) => {
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return cloneElement(children, {
    elevation: scrollTrigger ? 2 : 0,
  });
};

const Header = () => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [location, setLocation] = useLocation();
  const { settings, dispatchSettings } = useSettings();
  const { bedLayout, gridData } = useGridStateContext();

  const getPdf = async () => {
    await pdf(
      <MyDocument
        bedLayout={bedLayout}
        title={settings.document_title}
        colsPerPage={settings.document_cols_per_page}
        data={gridData}
      />
    )
      .toBlob()
      .then((blob) => {
        saveAs(blob, "grid.pdf");
      });
  };

  return (
    <div>
      <ElevationScroll>
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
                  classes={{
                    root: classes.iconButtonDownloadRoot,
                  }}
                >
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => setLocation("/update")}
                  className={classes.iconButtonOther}
                  classes={{
                    root: classes.iconButtonOtherRoot,
                  }}
                >
                  <ViewListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton
                  className={classes.iconButtonOther}
                  classes={{
                    root: classes.iconButtonOtherRoot,
                  }}
                  onClick={() => setLocation("/settings")}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </div>
  );
};

export default Header;
