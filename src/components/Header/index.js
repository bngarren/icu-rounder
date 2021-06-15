import { useState, cloneElement } from "react";
import MyDocument from "../MyDocument";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useScrollTrigger,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import GetAppIcon from "@material-ui/icons/GetApp";
import ViewListIcon from "@material-ui/icons/ViewList";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuIcon from "@material-ui/icons/Menu";

// React Router
import { useHistory, useRouteMatch } from "react-router-dom";

// Context
import { useAuthStateContext } from "../../context/AuthState";
import { useSettings } from "../../context/Settings";
import { useGridStateContext } from "../../context/GridState";

// Login
import { useLoginDialog } from "../../components/Login";

// Exporter
import Exporter from "../../components/Exporter";

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
  listItemText: {
    fontSize: "10pt",
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

  const { settings } = useSettings();
  const { bedLayout, gridData } = useGridStateContext();

  const { showLogin, LoginDialog } = useLoginDialog();

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

  const handleClickLogin = () => {
    showLogin((prevValue) => !prevValue);
  };

  return (
    <div>
      <ElevationScroll>
        <AppBar className={classes.navbar}>
          <Toolbar variant="dense" className={classes.toolbarRoot}>
            <div className={classes.toolbarTitleDiv}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="140"
                height="36"
              >
                <path
                  fill="#"
                  d="M22.216796875,21.974609375l5.6640625,0l0,7.40234375q-1.376953125,0.44921875-2.5927734375,0.6298828125t-2.4853515625,0.1806640625q-3.232421875,0-4.9365234375-1.8994140625t-1.7041015625-5.4541015625q0-3.45703125,1.9775390625-5.390625t5.4833984375-1.93359375q2.197265625,0,4.23828125,0.87890625l-1.005859375,2.421875q-1.5625-0.78125-3.251953125-0.78125q-1.962890625,0-3.14453125,1.318359375t-1.181640625,3.544921875q0,2.32421875,0.9521484375,3.5498046875t2.7685546875,1.2255859375q0.947265625,0,1.923828125-0.1953125l0-2.978515625l-2.705078125,0l0-2.51953125z M38.51337890625,18.869140625q0.60546875,0,1.005859375,0.087890625l-0.224609375,2.79296875q-0.361328125-0.09765625-0.87890625-0.09765625q-1.42578125,0-2.2216796875,0.732421875t-0.7958984375,2.05078125l0,5.556640625l-2.978515625,0l0-10.91796875l2.255859375,0l0.439453125,1.8359375l0.146484375,0q0.5078125-0.91796875,1.3720703125-1.4794921875t1.8798828125-0.5615234375z M42.7494140625,16.251953125q0-1.455078125,1.62109375-1.455078125t1.62109375,1.455078125q0,0.693359375-0.4052734375,1.0791015625t-1.2158203125,0.3857421875q-1.62109375,0-1.62109375-1.46484375z M45.8548828125,29.9921875l-2.978515625,0l0-10.91796875l2.978515625,0l0,10.91796875z M53.81162109375,30.1875q-1.923828125,0-3.0224609375-1.494140625t-1.0986328125-4.140625q0-2.685546875,1.1181640625-4.1845703125t3.0810546875-1.4990234375q2.060546875,0,3.14453125,1.6015625l0.09765625,0q-0.224609375-1.220703125-0.224609375-2.177734375l0-3.49609375l2.98828125,0l0,15.1953125l-2.28515625,0l-0.576171875-1.416015625l-0.126953125,0q-1.015625,1.611328125-3.095703125,1.611328125z M54.85654296875,27.814453125q1.142578125,0,1.6748046875-0.6640625t0.5810546875-2.255859375l0-0.322265625q0-1.7578125-0.5419921875-2.51953125t-1.7626953125-0.76171875q-0.99609375,0-1.5478515625,0.8447265625t-0.5517578125,2.4560546875t0.556640625,2.4169921875t1.591796875,0.8056640625z"
                />
                <path
                  fill="#"
                  d="M68.486046875,28.166l1.054,0l0-7.191q0-1.428,1.088-2.516t2.516-1.088q1.394,0,2.516,1.088q1.071,1.071,1.071,2.516l0,7.191l1.088,0l0-7.191q0-1.462,1.088-2.516q1.088-1.088,2.499-1.088q1.428,0,2.516,1.088t1.088,2.516l0,7.191l1.054,0l0-7.191q0-1.938-1.36-3.298t-3.298-1.36q-1.275,0-2.397,0.697q-1.139,0.714-1.632,1.819q-0.663-1.139-1.785-1.819q-1.173-0.697-2.448-0.697q-1.921,0-3.281,1.36q-1.377,1.377-1.377,3.298l0,7.191z M93.150326875,16.232q-1.904,0-3.196,1.377q-1.275,1.36-1.275,3.315l0,7.276l1.071,0l0-5.338l6.834,0l0,5.338l1.071,0l0-7.276q0-1.955-1.275-3.315q-1.326-1.377-3.23-1.377z M96.584326875,21.808l-6.834,0l0-0.884q0-1.462,0.986-2.533q1.003-1.088,2.414-1.088t2.448,1.088q0.986,1.071,0.986,2.533l0,0.884z M107.920606875,28.2l1.717,0l-7.599-6.069l7.599-5.848l-1.717,0l-6.528,5.202l0-5.202l-1.071,0l0,11.917l1.071,0l0-5.202z M113.034886875,24.936q0-0.816,0.578-1.479q0.578-0.697,1.394-0.697l0.221,0l3.179,0l0-1.054l-3.179,0l-0.221,0q-0.867-0.17-1.4195-0.748t-0.5525-1.377q0-1.003,0.5865-1.5895t1.6065-0.5865l5.78,0l0-1.071l-5.78,0q-1.309,0-2.278,0.969q-0.969,0.935-0.969,2.278q0,0.85,0.323,1.547t0.952,1.003q-0.629,0.459-0.952,1.207t-0.323,1.598q0,1.326,0.969,2.261q0.986,0.986,2.278,0.986l5.78,0l0-1.122l-5.78,0q-1.02,0-1.6065-0.578t-0.5865-1.547z M128.332166875,22.233l1.275,0q1.292,0,2.142-0.85t0.85-2.142q0-1.139-0.85-2.04q-0.901-0.935-2.142-0.935l-5.321,0l-1.054,0l0,11.934l1.054,0l0-5.967l2.771,0l3.621,5.967l1.275,0z M124.286166875,21.179l0-3.842l5.321,0q0.782,0,1.377,0.561q0.561,0.561,0.561,1.343q0,0.816-0.561,1.377q-0.595,0.561-1.377,0.561l-5.321,0z"
                />
              </svg>
            </div>
            <div className={classes.toolbarButtonsDiv}>
              <HeaderMenu
                customStyle={classes}
                onClickLogin={handleClickLogin}
                onDownloadPdf={getPdf}
              />
            </div>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      {LoginDialog}
    </div>
  );
};

const CustomListItemText = ({ children }) => {
  const classes = useStyles();
  return (
    <ListItemText classes={{ primary: classes.listItemText }}>
      {children}
    </ListItemText>
  );
};

const HeaderMenu = ({
  customStyle: classes,
  onClickLogin = (f) => f,
  onDownloadPdf = (f) => f,
}) => {
  const { userIsLoggedIn, signOut } = useAuthStateContext();
  const { settings } = useSettings();
  const [anchorEl, setAnchorEl] = useState(null);

  let history = useHistory(); // react router

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    onClickLogin();
    handleClose();
  };

  const handleLogout = () => {
    signOut();
    handleClose();
  };

  const handleOnExported = () => {
    handleClose();
  };

  const handleDownloadPdf = () => {
    onDownloadPdf();
    handleClose();
  };

  const handleEdit = () => {
    history.push("/update");
    handleClose();
  };

  const handleSettings = () => {
    history.push("/settings");
    handleClose();
  };

  const exportFilename = settings.export_filename
    ? settings.export_filename
    : "grid";

  const loggedInMenu = [
    <MenuItem
      onClick={handleEdit}
      disabled={Boolean(useRouteMatch("/update"))}
      key="menuItemEdit"
    >
      <ListItemIcon>
        <ViewListIcon />
      </ListItemIcon>
      <CustomListItemText>Edit Grid</CustomListItemText>
    </MenuItem>,
    <MenuItem
      onClick={handleSettings}
      disabled={Boolean(useRouteMatch("/settings"))}
      key="menuItemSettings"
    >
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <CustomListItemText>Settings</CustomListItemText>
    </MenuItem>,
    <Divider key="menuItemDivider1" />,
    <MenuItem onClick={handleDownloadPdf} key="menuItemDownloadPdf">
      <ListItemIcon>
        <PictureAsPdfIcon />
      </ListItemIcon>
      <CustomListItemText>Download PDF</CustomListItemText>
    </MenuItem>,
    <Exporter onExported={handleOnExported} filename={exportFilename}>
      <MenuItem key="menuItemExportJson">
        <ListItemIcon>
          <GetAppIcon />
        </ListItemIcon>
        <CustomListItemText>Export Grid</CustomListItemText>
      </MenuItem>
    </Exporter>,
    <Divider key="menuItemDivider2" />,
    <MenuItem onClick={handleLogout} key="menuItemLogout">
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <CustomListItemText>Logout</CustomListItemText>
    </MenuItem>,
  ];

  const loggedOutMenu = [
    <MenuItem onClick={handleLogin} key="menuItemLogin">
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <CustomListItemText>Login</CustomListItemText>
    </MenuItem>,
  ];

  return (
    <div>
      <IconButton
        className={classes.iconButtonOther}
        classes={{
          root: classes.iconButtonOtherRoot,
        }}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {userIsLoggedIn
          ? loggedInMenu.map((i) => i)
          : loggedOutMenu.map((i) => i)}
      </Menu>
    </div>
  );
};

export default Header;
