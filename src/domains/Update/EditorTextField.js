import { memo, forwardRef, useRef } from "react";

// MUI
import { FormControl, InputLabel, FormHelperText, Input } from "@mui/material";
import { styled } from "@mui/system";

// Components
import CustomLabel from "./CustomLabel";

/* Styling */
const StyledInput = styled(Input, {
  name: "EditorTextField",
  slot: "Input",
})(({ theme }) => ({}));

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
        <div htmlFor="editorTextField" {...InputLabelProps}>
          <CustomLabel label={label} isDirty={isDirty} />
        </div>
        <StyledInput
          id="editorTextField"
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
