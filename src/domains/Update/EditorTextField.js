import { memo, forwardRef, useRef } from "react";

// MUI
import { FormControl, Box, FormHelperText, Input } from "@mui/material";
import { styled } from "@mui/system";

// Components
import CustomLabel from "./CustomLabel";

/* Styling */
const StyledInput = styled(Input, {
  name: "EditorTextField",
  slot: "Input",
})(({ theme }) => ({}));

const StyledInputLabel = styled(Box, {
  name: "EditorTextField",
  slot: "InputLabel",
})(({ theme }) => ({
  position: "absolute",
  top: "-16px",
}));

const EditorTextField = forwardRef(
  (
    {
      inputSize = 20,
      isDirty,
      label,
      InputLabelProps,
      InputProps,
      inputProps,
      ...props
    },
    ref
  ) => {
    return (
      <FormControl sx={{ width: props.fullWidth && "100%" }}>
        <StyledInputLabel
          htmlFor={`editorTextField-${label}`}
          {...InputLabelProps}
        >
          <CustomLabel label={label} isDirty={isDirty} />
        </StyledInputLabel>
        <StyledInput
          id={`editorTextField-${label}`}
          inputProps={{
            ...inputProps,
            size: inputSize,
          }}
          {...InputProps}
          {...props}
          ref={ref}
        />
        <FormHelperText id="editorTextField-helperText"></FormHelperText>
      </FormControl>
    );
  }
);

export default memo(EditorTextField);
