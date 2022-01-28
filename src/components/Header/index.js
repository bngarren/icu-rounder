import { useState, cloneElement } from "react";

// MUI
import {
  AppBar,
  Toolbar,
  IconButton,
  useScrollTrigger,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GetAppIcon from "@mui/icons-material/GetApp";
import ViewListIcon from "@mui/icons-material/ViewList";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";

// Logo
import { ReactComponent as Logo } from "../../logo_color.svg";

// lodash
import { uniqueId } from "lodash";

// React Router
import { useMatch, useNavigate } from "react-router-dom";

// Context
import { useAuthStateContext } from "../../context/AuthState";
import { useSettings } from "../../context/Settings";

// hooks
import usePdfMaker from "../../hooks/usePdfMaker";

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
  const navigate = useNavigate();

  const { showLogin, LoginDialog } = useLoginDialog();

  const { getPdf } = usePdfMaker();

  const handleClickLogin = () => {
    showLogin((prevValue) => !prevValue);
  };

  const handleClickLogo = () => {
    navigate("/");
  };

  return (
    <div>
      <ElevationScroll>
        <AppBar className={classes.navbar}>
          <Toolbar variant="dense" className={classes.toolbarRoot}>
            <div
              className={classes.toolbarTitleDiv}
              onClick={handleClickLogo}
              style={{ cursor: "pointer" }}
            >
              <Logo width="175px" />
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
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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
    handleClose();
    navigate("/update");
  };

  const handleSettings = () => {
    handleClose();
    navigate("/settings");
  };

  const exportFilename = settings.export_filename
    ? settings.export_filename
    : "grid";

  const loggedInMenu = [
    <MenuItem onClick={handleEdit} disabled={Boolean(useMatch("/update"))}>
      <ListItemIcon>
        <ViewListIcon />
      </ListItemIcon>
      <CustomListItemText>Edit Grid</CustomListItemText>
    </MenuItem>,
    <MenuItem
      onClick={handleSettings}
      disabled={Boolean(useMatch("/settings"))}
    >
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <CustomListItemText>Settings</CustomListItemText>
    </MenuItem>,
    <Divider />,
    <MenuItem onClick={handleDownloadPdf}>
      <ListItemIcon>
        <PictureAsPdfIcon />
      </ListItemIcon>
      <CustomListItemText>Download PDF</CustomListItemText>
    </MenuItem>,
    <Exporter onExported={handleOnExported} filename={exportFilename}>
      <MenuItem>
        <ListItemIcon>
          <GetAppIcon />
        </ListItemIcon>
        <CustomListItemText>Export Grid</CustomListItemText>
      </MenuItem>
    </Exporter>,
    <Divider />,
    <MenuItem onClick={handleLogout}>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <CustomListItemText>Logout</CustomListItemText>
    </MenuItem>,
  ];

  const loggedOutMenu = [
    <MenuItem onClick={handleLogin}>
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
        size="large"
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
          ? loggedInMenu.map((i) =>
              cloneElement(i, { key: uniqueId("menuItem-") })
            )
          : loggedOutMenu.map((i) =>
              cloneElement(i, { key: uniqueId("menuItem-") })
            )}
      </Menu>
    </div>
  );
};

export default Header;
