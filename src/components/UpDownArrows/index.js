import { Grid, IconButton } from "@material-ui/core";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "auto",
  },
  gridItemUp: {
    transform: "translateY(-5px)",
  },
  gridItemDown: {
    transform: "translateY(-15px)",
  },
  iconButton: {
    padding: 0,
  },
}));

const UpDownArrows = ({ onUp = (f) => f, onDown = (f) => f }) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item className={classes.gridItemUp}>
        <IconButton onClick={onUp} className={classes.iconButton}>
          <ArrowDropUpIcon />
        </IconButton>
      </Grid>
      <Grid item className={classes.gridItemDown}>
        <IconButton onClick={onDown} className={classes.iconButton}>
          <ArrowDropDownIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default UpDownArrows;
