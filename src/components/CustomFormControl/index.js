import { useState, useEffect, cloneElement } from "react";
import { Grid, IconButton, Zoom } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SaveIcon from "@material-ui/icons/Save";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
  },
  unsaved: {
    display: "flex",
    flexDirection: "row",
  },
}));

const CustomFormControl = ({ initialValue, children }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [diff, setDiff] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleOnChange = (val) => {
    if (val === initialValue) {
      setDiff(false);
    } else {
      setDiff(true);
    }
    setValue(val);
  };

  return (
    <Grid container className={clsx(classes.root, { [classes.unsaved]: diff })}>
      <Zoom in={diff} disableStrictModeCompat={true} timeout={300}>
        <Grid item alignSelf="center">
          <IconButton color="primary">
            <SaveIcon />
          </IconButton>
        </Grid>
      </Zoom>
      <Grid item>
        {cloneElement(children, {
          value: value,
          onChange: (e) => handleOnChange(e.target.value),
        })}
      </Grid>
    </Grid>
  );
};

export default CustomFormControl;
