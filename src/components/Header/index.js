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
              <Typography variant="h6" style={{ marginRight: "3px" }}>
                Griddy
              </Typography>
              <Typography variant="overline">alpha</Typography>
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

const HeaderMenu = ({
  customStyle: classes,
  onClickLogin = (f) => f,
  onDownloadPdf = (f) => f,
}) => {
  const { userIsLoggedIn, signOut } = useAuthStateContext();
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

  const handleExportJson = () => {};

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

  const loggedInMenu = [
    <MenuItem onClick={handleEdit} disabled={Boolean(useRouteMatch("/update"))}>
      <ListItemIcon>
        <ViewListIcon />
      </ListItemIcon>
      <ListItemText>Edit Grid</ListItemText>
    </MenuItem>,
    <MenuItem
      onClick={handleSettings}
      disabled={Boolean(useRouteMatch("/settings"))}
    >
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText>Settings</ListItemText>
    </MenuItem>,
    <Divider />,
    <MenuItem onClick={handleDownloadPdf}>
      <ListItemIcon>
        <PictureAsPdfIcon />
      </ListItemIcon>
      <ListItemText>Download PDF</ListItemText>
    </MenuItem>,
    <MenuItem onClick={handleExportJson}>
      <ListItemIcon>
        <GetAppIcon />
      </ListItemIcon>
      <ListItemText>Export Grid</ListItemText>
    </MenuItem>,
    <Divider />,
    <MenuItem onClick={handleLogout}>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText>Logout</ListItemText>
    </MenuItem>,
  ];

  const loggedOutMenu = [
    <MenuItem onClick={handleLogin}>
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <ListItemText>Login</ListItemText>
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
