import {forwardRef} from "react";

import { TextField } from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";

const useStylesForCustomTextField = makeStyles((theme) => ({
  textFieldRoot: {
    borderBottom: "1.4px dotted #e2e2e1",
    overflow: "hidden",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
    "&$textFieldFocused": {
      backgroundColor: "#fff",
      borderColor: theme.palette.secondary.light,
    },
    paddingBottom: "2px",
    marginBottom: "4px",
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
  ({ InputProps, InputLabelProps, ...props }, ref) => {
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
            style: {
              fontSize: "10pt",
              paddingBottom: "2px",
              paddingLeft: "4px",
            },
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