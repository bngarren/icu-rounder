import { memo } from "react";

// MUI
import { TextField } from "@mui/material";
import { styled } from "@mui/system";

/* Styling */
const StyledTextField = styled(TextField, {
  name: "StyledTextField",
  shouldForwardProp: (prop) => prop !== "diff",
})(({ diff, theme }) => ({
  margin: "6px 0px",
  // Change label color based on diff status (unsaved vs saved)
  "& .MuiFormLabel-root": {
    ...(diff
      ? {
          color: theme.palette.secondary.dark,
          fontWeight: theme.typography.fontWeightBold,
        }
      : {
          color: theme.palette.primary.light,
        }),
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderWidth: "0.1em",
      borderColor: theme.palette.primary.main,
      boxShadow: "rgba(17, 17, 26, 0.15) 0px 1px 0px",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: theme.typography.formFontSizeLevel1,
  },
}));

const EditorTextField = ({ id, inputSize = 20, diff, ...props }) => {
  return (
    <StyledTextField
      id={id}
      diff={diff}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        size: inputSize,
      }}
      {...props}
    />
  );
};

export default memo(EditorTextField);
