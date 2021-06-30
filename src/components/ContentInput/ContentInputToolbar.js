import { AppBar, Toolbar } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";

import QuickAddInput from "./QuickAddInput";

const useStyles = makeStyles((theme) => ({
  appBarRoot: {
    backgroundColor: "transparent",
    borderBottom: "1px solid #eee",
  },
  toolbar: {
    minHeight: "auto",
    padding: "4px 0px",
  },
}));

const ContentInputToolbar = ({ onAddSection = (f) => f }) => {
  const classes = useStyles();
  return (
    <AppBar
      position="static"
      className={classes.appBarRoot}
      square={true}
      elevation={0}
    >
      <Toolbar
        disableGutters
        variant="dense"
        classes={{
          dense: classes.toolbar,
        }}
      >
        <QuickAddInput placeholder="Add Section" onSubmit={onAddSection} />
      </Toolbar>
    </AppBar>
  );
};

export default ContentInputToolbar;
