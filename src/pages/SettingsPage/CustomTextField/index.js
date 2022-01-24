import { forwardRef } from "react";

import { InputBase } from "@mui/material";

import { makeStyles } from "@mui/styles";
const useStyles = makeStyles((theme) => ({
  textFieldRoot: {
    border: "1px solid #e2e2e1",
    overflow: "hidden",
    borderRadius: "3px",
    backgroundColor: "white",
    paddingLeft: "6px",
    "&:hover": {
      backgroundColor: "white",
    },
    "&$textFieldFocused": {
      backgroundColor: "#fff",
      borderColor: theme.palette.secondary.main,
    },
  },
  textFieldFocused: {},
}));

const CustomTextField = forwardRef(({ inputProps, ...props }, ref) => {
  const classes = useStyles();

  return (
    <InputBase
      inputRef={ref}
      classes={{
        root: classes.textFieldRoot,
        focused: classes.textFieldFocused,
      }}
      inputProps={{
        ...inputProps,
        style: { fontSize: "11pt" },
      }}
      {...props}
    />
  );
});

export default CustomTextField;
