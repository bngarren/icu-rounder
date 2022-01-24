import { Grid, IconButton } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "auto",
    transform: "translateY(-5px)",
  },
  gridItemUp: {
    height: "12px",
  },
  gridItemDown: {
    height: "12px",
  },
  upIcon: {
    transform: "scale(1.5)",
  },
  downIcon: {
    transform: "scale(1.5)",
  },
}));

const UpDownArrows = ({ onUp = (f) => f, onDown = (f) => f }) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item className={classes.gridItemUp}>
        <ArrowDropUpIcon className={classes.upIcon} />
      </Grid>
      <Grid item className={classes.gridItemDown}>
        <ArrowDropDownIcon className={classes.downIcon} />
      </Grid>
    </Grid>
  );
};

export default UpDownArrows;
