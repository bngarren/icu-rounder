import { version } from "../../../package.json";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";

// Context
import { useAuthStateContext } from "../../context/AuthState";

// Login
import { useLoginDialog } from "../../components/Login";

const useStyles = makeStyles((theme) => ({
  footer: {
    position: "relative",
    bottom: 0,
    width: "100%",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    fontSize: "8pt",
    padding: "10px 0px",
    margin: "200px auto 5px auto",
    maxWidth: "300px",
  },
  linksDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonLink: {
    background: "none!important",
    border: "none",
    padding: "0 !important",
    color: "#069",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "8pt",
  },
  copyrightVersion: {
    display: "flex",
    flexDirection: "column",
  },
}));

const Footer = () => {
  const classes = useStyles();
  const { userIsLoggedIn, signOut } = useAuthStateContext();
  const { showLogin, LoginDialog } = useLoginDialog();

  const handleLogin = () => {
    showLogin((prevValue) => !prevValue);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className={classes.footer}>
      <div className={classes.root}>
        <div className={classes.linksDiv}>
          <Link to={{ pathname: "/update" }}>Edit</Link>
          <Link to={{ pathname: "/settings" }}>Settings</Link>
          <Link to={{ pathname: "/document" }}>Document</Link>
          {userIsLoggedIn ? (
            <button onClick={handleLogout} className={classes.buttonLink}>
              Logout
            </button>
          ) : (
            <button onClick={handleLogin} className={classes.buttonLink}>
              Login
            </button>
          )}
        </div>
        <div className={classes.copyrightVersion}>
          <span>
            Grid Maker <i>v{version}</i>
          </span>
          <span>&copy; 2021</span>
        </div>
        {LoginDialog}
      </div>
    </div>
  );
};

export default Footer;
