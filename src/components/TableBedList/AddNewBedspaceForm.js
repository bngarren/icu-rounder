import { useState } from "react";

// MUI
import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";

// Context
import { useGridStateContext } from "../../context/GridState";

/* Styling */

const StyledOutlinedInput = styled(OutlinedInput, {
  name: "AddNewBedspaceForm",
  slot: "input",
})(() => ({}));

const AddNewBedspaceForm = ({ onSubmit = (f) => f }) => {
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
    <Box>
      <StyledOutlinedInput
        placeholder="Add bed"
        size="small"
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
        onKeyPress={handleOnKeyPress}
        inputProps={{
          size: 10,
        }}
        endAdornment={
          <Zoom in={value.trim() !== ""}>
            <InputAdornment position="end">
              <IconButton
                onClick={handleOnSubmit}
                size="large"
                sx={{
                  padding: "3px",
                }}
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          </Zoom>
        }
      />
    </Box>
  );
};

export default AddNewBedspaceForm;
