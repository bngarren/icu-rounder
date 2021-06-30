import { forwardRef } from "react";

import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStylesForCustomTextField = makeStyles((theme) => ({
  textFieldRoot: {
    overflow: "hidden",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
    "&$textFieldFocused": {
      backgroundColor: "#fff",
      borderColor: theme.palette.secondary.light,
    },
  },
  textFieldNativeInput: {
    borderBottom: "1.4px dotted #e2e2e1",
    fontSize: "10pt",
    paddingBottom: "2px",
    paddingLeft: "4px",
  },
  textFieldFocused: {},
  textFieldInputLabelRoot: {
    color: "black",
    fontSize: "12pt",
    fontWeight: "bold",
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
  ({ InputProps, InputLabelProps, inputProps, ...props }, ref) => {
    const classes = useStylesForCustomTextField();
    return (
      <TextField
        inputRef={ref}
        InputProps={{
          ...InputProps,
          classes: {
            root: classes.textFieldRoot,
            focused: classes.textFieldFocused,
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
