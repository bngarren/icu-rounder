import { useState, useEffect } from "react";

// MUI
import { styled } from "@mui/system";
import { Autocomplete, Checkbox } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Components
import EditorTextField from "../EditorTextField";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/* Styling */

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiAutocomplete-popper": {
    width: "300px !important",
    zIndex: 200,
    fontSize: 13,
    color: "#586069",
    backgroundColor: "#f6f8fa",
  },
  "& .MuiAutocomplete-option": {
    minHeight: "auto",
    alignItems: "center",
    padding: 3,
    // Selected
    '&[aria-selected="true"]': {},
    // Hover
    '&[data-focus="true"]': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
    },
  },
  "& .MuiAutocomplete-paper": {
    margin: 0,
    color: "#586069",
    fontSize: 14,
    backgroundColor: "#f6f8fa",
  }
}))

const ContingencyInput = ({
  options,
  value,
  diff,
  ...props
}) => {

  return (
    <StyledAutocomplete
      size="small"
      limitTags={5}
      fullWidth
      multiple
      freeSolo
      clearOnBlur
      filterSelectedOptions
      options={options}
      renderInput={(params) => {
        return (
          <EditorTextField
            {...params}
            diff={diff}
            InputLabelProps={{
              shrink: true,
            }}
            label="Contingencies"
            placeholder="Add contingency"
          />
        );
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            sx={{
              mr: 1,
              padding: "3px",
              color: "primary.light",
              "&:hover": {
                color: "primary.main",
              },
            }}
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      {...props}
      value={value ? value : []}
    />
  );
};

export default ContingencyInput;
