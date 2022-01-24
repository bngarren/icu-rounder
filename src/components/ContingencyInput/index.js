import { useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from "@mui/material/Checkbox";
import { TextField } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
  popper: {
    width: "300px !important",
    zIndex: 200,
    fontSize: 13,
    color: "#586069",
    backgroundColor: "#f6f8fa",
  },
  autocompletePaper: {
    margin: 0,
    color: "#586069",
    fontSize: 14,
    backgroundColor: "#f6f8fa",
  },
  option: {
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
  checkboxRoot: {
    padding: "3px",
    "&:hover": {
      backgroundColor: "rgba(196, 196, 196, 0.18)",
    },
  },
  checkboxColorSecondary: {
    "&.Mui-checked": {
      color: theme.palette.secondary,
      "&:hover": {
        backgroundColor: "rgba(183, 209, 0, 0.1)",
      },
    },
  },
}));

const ContingencyInput = ({
  customStyle: textFieldClasses,
  options,
  value,
  diff,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Autocomplete
      classes={{
        popper: classes.popper,
        option: classes.option,
        paper: classes.autocompletePaper,
      }}
      size="small"
      fullWidth
      limitTags={5}
      multiple
      freeSolo
      clearOnBlur
      filterSelectedOptions
      options={options}
      renderInput={(params) => {
        return (
          <TextField
            InputProps={{
              ...params.InputProps,
              classes: {
                root: textFieldClasses.textFieldRoot,
                focused: textFieldClasses.textFieldFocused,
              },
            }}
            inputProps={{
              ...params.inputProps,
              style: { fontSize: "11pt" },
            }}
            InputLabelProps={{
              ...params.InputLabelProps,
              shrink: true,
              classes: {
                root: textFieldClasses.textFieldInputLabelRoot,
                focused: textFieldClasses.textFieldInputLabelFocused,
              },
            }}
            variant="filled"
            fullWidth
            label="Contingencies"
            placeholder="Add contingency"
          />
        );
      }}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            classes={{
              root: classes.checkboxRoot,
              colorSecondary: classes.checkboxColorSecondary,
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
