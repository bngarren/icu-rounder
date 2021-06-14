import { useState } from "react";
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
  Zoom,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";

// Context
import { useGridStateContext } from "../../context/GridState";

const useStyles = makeStyles((theme) => ({
  text: {
    marginRight: 6,
    color: "#626060",
    fontStyle: "italic",
  },
  textFieldRoot: {
    paddingRight: 2,
    "&$textFieldNotchedOutline": {
      borderWidth: 1,
    },
    "&$textFieldFocused": {
      borderWidth: 1,
    },
    "&$textFieldFocused $textFieldNotchedOutline": {
      borderWidth: 2,
      borderColor: theme.palette.secondary.main,
    },
  },
  textFieldFocused: {},
  textFieldNotchedOutline: {},
  textFieldInput: {
    padding: "4px 0px 4px 6px",
    width: 40,
  },
  addIconButton: {
    padding: 1,
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
}));

const AddNewBedspaceForm = ({ onSubmit = (f) => f }) => {
  const classes = useStyles();
  const { bedLayout, gridData, updateGridData } = useGridStateContext();
  const [value, setValue] = useState("");

  const newBedAlreadyExists = (bed) => bedLayout.includes(bed);

  const handleOnChange = (val) => {
    setValue(val);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      handleOnSubmit();
    }
  };

  /* Handles to submission of a new bedspace.
  **
  If this bed already exists, it just finds the corresponding key in
  the gridData array and sends it back to the parent through onSubmit
  so that that row can be highlighted.
  If this bed doesn't exist, it is added to bedLayout and the gridData
  is updated through updateGridData, and when this is complete, the parent
  is notified through the callback onSubmit and that new row is highlighted.
  **
   */
  const handleOnSubmit = () => {
    const valToSubmit = value.trim();
    if (newBedAlreadyExists(valToSubmit)) {
      console.log(`${valToSubmit} already exists!`);
      const bedKeyExists = gridData.findIndex(
        (element) => element.bed === valToSubmit
      );
      onSubmit(bedKeyExists);
    } else {
      const newBedLayout = [...bedLayout, valToSubmit];
      updateGridData(gridData, newBedLayout).then((res) => {
        if (res) {
          const bedKeyNew = res.findIndex(
            (element) => element.bed === valToSubmit
          );
          onSubmit(bedKeyNew);
        }
      });
    }
    setValue("");
  };

  return (
    <div>
      <Typography variant="caption" className={classes.text}>
        Add bed
      </Typography>
      <OutlinedInput
        classes={{
          root: classes.textFieldRoot,
          input: classes.textFieldInput,
          notchedOutline: classes.textFieldNotchedOutline,
          focused: classes.textFieldFocused,
        }}
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
        onKeyPress={handleOnKeyPress}
        endAdornment={
          <Zoom in={value.trim() !== ""}>
            <InputAdornment position="end">
              <IconButton
                className={classes.addIconButton}
                onClick={handleOnSubmit}
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          </Zoom>
        }
      />
    </div>
  );
};

export default AddNewBedspaceForm;
