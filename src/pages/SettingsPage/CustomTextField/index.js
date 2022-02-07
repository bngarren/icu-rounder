import { forwardRef } from "react";

// MUI
import { TextField } from "@mui/material";
import { styled } from "@mui/system";

/* Styling */
const StyledTextField = styled(TextField, {
  name: "CustomTextField",
  slot: "Root",
})(({ theme }) => ({
  overflow: "hidden",
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "white",
  },
  "&.Mui-focused fieldset": {
    backgroundColor: "white",
    borderColor: theme.palette.secondary.dark,
  },
  "& .MuiOutlinedInput-input": {
    fontSize: theme.typography.formFontSizeLevel1,
    paddingTop: "6px",
    paddingBottom: "6px",
  },
  "& .MuiInputBase-multiline": {
    padding: 0,
    "& .MuiOutlinedInput-input": {
      padding: "6px 14px 6px 14px",
    },
  },
}));

/* Using a custom TextField implementation here, but currently only providing
styling... */
//TODO Consider just using regular TextField
const CustomTextField = forwardRef(function CustomTextField(
  { sx, ...props },
  ref
) {
  return <StyledTextField inputRef={ref} sx={sx} {...props} />;
});

export default CustomTextField;
