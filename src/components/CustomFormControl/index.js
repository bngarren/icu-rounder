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
  gridForSaveButton: {
    alignSelf: "center",
  },
  gridForInput: {
    flexGrow: "1",
  },
  saveIconButton: {
    padding: "5px",
  },
}));

const CustomFormControl = ({
  initialValue,
  id,
  onSave = (f) => f,
  children,
}) => {
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

  const handleOnSave = () => {
    if (id !== null) {
      onSave(id, value);
      setDiff(false);
    }
  };

  return (
    <Grid container className={clsx(classes.root, { [classes.unsaved]: diff })}>
      <Zoom in={diff} disableStrictModeCompat={true} timeout={300}>
        <Grid item className={classes.gridForSaveButton}>
          <IconButton
            onClick={handleOnSave}
            color="primary"
            className={classes.saveIconButton}
          >
            <SaveIcon />
          </IconButton>
        </Grid>
      </Zoom>
      <Grid item className={classes.gridForInput}>
        {cloneElement(children, {
          value: value,
          onChange: (e) => handleOnChange(e.target.value),
        })}
      </Grid>
    </Grid>
  );
};

export default CustomFormControl;
