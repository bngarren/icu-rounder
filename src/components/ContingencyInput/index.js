import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import { TextField } from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
  popper: {
    width: "300px !important",
    zIndex: 1200,
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
      debug={false}
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
              disableUnderline: true,
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
      renderOption={(option, { selected }) => (
        <div key={option}>
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
        </div>
      )}
      {...props}
      value={value ? value : []}
    />
  );
};

export default ContingencyInput;
