import { forwardRef } from "react";

import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStylesForCustomTextField = makeStyles((theme) => ({
  textFieldRoot: {
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
    "&$textFieldFocused": {
      backgroundColor: "#fff",
    },
  },
  textFieldNativeInput: {
    borderBottom: "1px dotted transparent",
    transition: "border-color linear 0.1s",
    fontSize: "10pt",
    paddingBottom: "2px",
    paddingLeft: "4px",
    "&:hover": {
      borderColor: "#5f5f5f",
    },
    "&:focus": {
      borderStyle: "solid",
      borderColor: "#a9a9a9",
    },
  },
  textFieldFocused: {},
  textFieldInputLabelRoot: {
    color: "#626060",
    fontSize: "11pt",
    "&$textFieldInputLabelFocused": {
      color: theme.palette.secondary.main,
    },
  },
  textFieldInputLabelFocused: {},
  textFieldInputLabelFilled: {
    "&.MuiInputLabel-shrink.MuiInputLabel-marginDense": {
      transform: "translate(4px, 6px) scale(0.75)",
    },
  },
}));

const CustomTextField = forwardRef(
  (
    {
      InputProps,
      InputLabelProps,
      inputProps,
      tooltip = "",
      overflow = "inherit",
      ...props
    },
    ref
  ) => {
    const classes = useStylesForCustomTextField();
    return (
      <TextField
        title={tooltip}
        inputRef={ref}
        InputProps={{
          ...InputProps,
          classes: {
            root: classes.textFieldRoot,
            focused: classes.textFieldFocused,
          },
          style: {
            overflow: overflow,
            ...props.style,
          },
          disableUnderline: true,
          inputProps: {
            ...inputProps,
            className: classes.textFieldNativeInput,
          },
        }}
        InputLabelProps={{
          ...InputLabelProps,
          classes: {
            root: classes.textFieldInputLabelRoot,
            focused: classes.textFieldInputLabelFocused,
            filled: classes.textFieldInputLabelFilled,
          },
          shrink: true,
        }}
        size="small"
        {...props}
      />
    );
  }
);

export default CustomTextField;
