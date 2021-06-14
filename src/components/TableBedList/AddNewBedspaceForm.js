import { useState } from "react";
import { OutlinedInput, InputAdornment, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";

// Context
import { useGridStateContext } from "../../context/GridState";

const useStyles = makeStyles((theme) => ({
  textFieldRoot: {
    paddingRight: 4,
  },
  textFieldInput: {
    padding: "4px 4px",
    width: 64,
  },
  addIconButton: {
    padding: 1,
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

  const handleOnSubmit = () => {
    const valToSubmit = value.trim();
    if (newBedAlreadyExists(valToSubmit)) {
      console.log(`${valToSubmit} already exists!`);
    } else {
      const newBedLayout = [...bedLayout, valToSubmit];
      updateGridData(gridData, newBedLayout);
    }
    setValue("");
    onSubmit(valToSubmit);
  };

  return (
    <div>
      <OutlinedInput
        classes={{
          root: classes.textFieldRoot,
          input: classes.textFieldInput,
        }}
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
        onKeyPress={handleOnKeyPress}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              className={classes.addIconButton}
              onClick={handleOnSubmit}
            >
              <AddIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
};

export default AddNewBedspaceForm;
