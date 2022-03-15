import { memo, forwardRef } from "react";

// MUI
import { TextField } from "@mui/material";
import { styled } from "@mui/system";

/* Styling */
const StyledTextField = styled(TextField, {
  name: "EditorTextField",
  slot: "Root",
  shouldForwardProp: (prop) => prop !== "diff",
})(({ diff, theme }) => ({
  // Change label color based on diff status (unsaved vs saved)
  "& .MuiFormLabel-root": {
    fontWeight: "bold",
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
    borderRadius: "2px",
    "& fieldset": {
      // Baseline border
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.light,
    },
    "&.Mui-focused fieldset": {
      // Focused border
      borderWidth: "0.1em",
      borderColor: theme.palette.primary.main,
      boxShadow: "rgba(17, 17, 26, 0.15) 0px 1px 0px",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: theme.typography.formFontSizeLevel1,
    paddingTop: "10px",
    paddingBottom: "4px",
  },
  "& .MuiInputBase-multiline": {
    padding: 0,
    "& .MuiOutlinedInput-input": {
      padding: "10px 14px 4px 14px",
    },
  },
}));

const EditorTextField = forwardRef(({ inputSize = 20, ...props }, ref) => {
  return (
    <StyledTextField
      ref={ref}
      margin="none"
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        size: inputSize,
      }}
      {...props}
    />
  );
});

export default memo(EditorTextField);
