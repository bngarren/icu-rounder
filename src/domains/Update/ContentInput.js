import * as React from "react";

// MUI
import { Grid, Box, Stack, Typography, TextField } from "@mui/material";
import { styled } from "@mui/system";

// React-hook-form
import { Controller, useFormState, useFormContext } from "react-hook-form";

// Components
import ContentInputToolbar from "./ContentInputToolbar";
import NestedContentInput from "./NestedContentInput";

// Util
import { v4 as uuidv4 } from "uuid";

/* Styling - ContentInput */

const StyledRoot = styled(Box, {
  name: "ContentInput",
  slot: "Root",
})(() => ({
  backgroundColor: "white",
  padding: 0,
  minHeight: "225px",
}));

const StyledHeader = styled(Stack, {
  name: "ContentInput",
  slot: "header",
})(() => ({
  alignItems: "center",
  paddingTop: "10px",
  paddingBottom: "8px",
  minHeight: "45px",
}));

const StyledContentInputContainer = styled(Grid, {
  name: "ContentInput",
  slot: "contentInput",
})(() => ({
  flexDirection: "row",
  flex: "2",
}));

/**
 * ContentInput
 * This component renders either the "simpleContent" input--which is just a standard
 * textfield input, or the "nestedContent" input--which is a more complex component
 * that allows for structuring the input data into sections and items, to make for
 * a more compact layout in the actual grid.
 *
 */
const ContentInput = () => {
  const { control, setValue, getValues, watch, unregister } = useFormContext();

  /* want to know if the content type has been changed in the toolbar
  so we can display the correct one, i.e. simple versus nested */
  const contentType = watch("contentType");

  /* Since our contentType is toggled and the components are unmounted, 
  we use the RHF unregister function each time contentType changes. Prior to this fix,
  there was a bug with the field values getting mixed up between simple vs nestedContent */
  React.useEffect(() => {
    if (contentType === "simple") {
      unregister("nestedContent", { keepDefaultValue: true, keepValue: true });
    }
    if (contentType === "nested") {
      unregister("simpleContent", { keepDefaultValue: true, keepValue: true });
    }
  }, [contentType, unregister]);

  /* Tracks whether any of these form values have become dirty */
  const { isDirty: contentInputIsDirty } = useFormState({
    control,
    name: ["contentType", "simpleContent", "nestedContent"],
  });

  const handleOnAddSection = (value) => {
    const current = getValues("nestedContent");
    const newSection = {
      id: uuidv4(),
      title: value || "",
      top: "",
      items: [],
    };

    let result;
    if (Array.isArray(current)) {
      result = current.concat([newSection]);
    } else {
      result = [newSection];
    }
    setValue("nestedContent", result, { shouldDirty: true });
  };

  const handleOnSelectTemplate = (value) => {
    /* create a new nestedContent array based on the template */
    let newNestedContent = [];
    if (Array.isArray(value)) {
      value.forEach((el) => {
        newNestedContent.push({
          id: uuidv4(),
          title: el || "",
          top: "",
          items: [],
        });
      });
    }

    setValue("nestedContent", newNestedContent, { shouldDirty: true });
  };

  return (
    <StyledRoot>
      <StyledHeader direction="row" spacing={1}>
        <Typography
          variant="h6"
          sx={{
            /* needs to match font appearance of
          EditorTextField labels */
            px: 0.8,
            fontSize: "1rem",
            fontWeight: "bold",
            transform: "scale(0.75)",
            color: contentInputIsDirty && "secondary.dark",
          }}
        >
          Content
        </Typography>

        <ContentInputToolbar
          control={control}
          contentType={contentType}
          onAddSection={handleOnAddSection}
          onSelectTemplate={handleOnSelectTemplate}
        />
      </StyledHeader>
      <StyledContentInputContainer>
        {contentType === "simple" && (
          <Controller
            name="simpleContent"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                multiline
                minRows={10}
                maxRows={20}
                sx={{
                  lineHeight: "1.5em",
                  "& .MuiOutlinedInput-notchedOutline": {
                    //border: "none",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "2px",
                    "& fieldset": {
                      // Baseline border
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.light",
                    },
                    "&.Mui-focused fieldset": {
                      // Focused border
                      borderWidth: "0.1em",
                      borderColor: "primary.main",
                      boxShadow: "rgba(17, 17, 26, 0.15) 0px 1px 0px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    fontSize: "formFontSizeLevel1",
                  },
                  "& .MuiInputBase-multiline": {
                    padding: 0,
                    "& .MuiOutlinedInput-input": {
                      padding: "10px 14px 4px 14px",
                    },
                  },
                }}
                {...field}
              />
            )}
          />
        )}

        {contentType === "nested" && (
          <Controller
            control={control}
            name="nestedContent"
            render={({
              field: { value, onChange, ref },
              fieldState,
              formState,
            }) => {
              console.log("value", value);
              return (
                <NestedContentInput
                  data={value}
                  onChange={onChange}
                  inputRef={ref}
                  fieldState={fieldState}
                  formState={formState}
                />
              );
            }}
          />
        )}
      </StyledContentInputContainer>
    </StyledRoot>
  );
};

/* ContentInput.whyDidYouRender = {
  logOnDifferentValues: true,
}; */

export default ContentInput;
