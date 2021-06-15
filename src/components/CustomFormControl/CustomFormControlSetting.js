import { useState, useEffect, cloneElement, useRef } from "react";
import { Grid, Typography, Zoom, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    "&:hover": {
      backgroundColor: "#dbdbdb24",
    },
  },
  rootEditing: {
    borderLeft: `4px solid ${theme.palette.secondary.light}`,
    paddingLeft: 6,
  },
  rootDiff: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    paddingLeft: 6,
  },
  label: {
    fontSize: "11pt",
    fontWeight: "bold",
  },
  initialValue: {
    fontSize: "11pt",
    border: "1px solid #d7d7d7",
    borderRadius: "3px",
    padding: "2px 6px",
  },
  gridForInput: {
    flexGrow: "1",
  },
  revertButton: {
    marginLeft: "5px",
    fontSize: "9pt",
    padding: "0px 4px",
    minWidth: "40px",
    "&:hover": {
      color: "#6a6a6a",
    },
    color: "#a2a2a2",
  },
  saveButton: {
    marginLeft: "5px",
    fontSize: "9pt",
    padding: "0px 4px",
    minWidth: "40px",
    textDecoration: "underline",
    "&:hover": {
      textDecoration: "underline",
    },
    color: theme.palette.primary.main,
    fontWeight: "bold",
  },
}));

const CustomFormControlSetting = ({
  label,
  initialValue,
  id,
  onSave = (f) => f,
  children,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [diff, setDiff] = useState(false);

  const childElement = cloneElement(children, {
    value: value,
    onChange: (e) => handleOnChange(e.target.value),
  });

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

  const handleOnClickRevert = () => {
    setDiff(false);
    setValue(initialValue);
  };

  const handleOnSave = () => {
    if (id !== null) {
      onSave(id, value);
      setDiff(false);
    }
  };

  return (
    <Grid
      container
      className={clsx(classes.root, {
        [classes.rootDiff]: diff,
      })}
    >
      <Grid item xs={12} container wrap="nowrap" alignItems="center">
        <Grid item>
          <Typography className={classes.label} variant="caption">
            {label}
          </Typography>
        </Grid>

        <Grid item xs>
          <Zoom in={diff} disableStrictModeCompat={true} timeout={300}>
            <Grid container>
              <Button
                className={classes.revertButton}
                onClick={handleOnClickRevert}
              >
                Revert
              </Button>
              <Button onClick={handleOnSave} className={classes.saveButton}>
                Save
              </Button>
            </Grid>
          </Zoom>
        </Grid>
      </Grid>
      <Grid item xs>
        {childElement}
      </Grid>
    </Grid>
  );
  /* return (
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
        {label}
        {initialValue}
        {cloneElement(children, {
          value: value,
          onChange: (e) => handleOnChange(e.target.value),
        })}
      </Grid>
    </Grid>
  ); */
};

export default CustomFormControlSetting;
