import { useState, useEffect, useRef, useMemo } from "react";

// MUI
import {
  Grid,
  Box,
  Stack,
  Toolbar,
  Typography,
  Switch,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// React-hook-form
import { useForm, FormProvider } from "react-hook-form";

// Components
import DemoBox from "./DemoBox";
import Editor from "./Editor";
import { ButtonStandard } from "../../components";

// Context
import { useSettings } from "../../context/Settings";

/* Styling */

const StyledNavigateIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light,
  padding: 5,
  "&:hover": {
    color: theme.palette.secondary.dark,
    cursor: "pointer",
    backgroundColor: "transparent",
  },
}));

const EditorController = ({
  initialGridDataElementData,
  dirtyFormCallback = (f) => f,
  onChangeGridDataElement = (f) => f,
  onSave = (f) => f,
}) => {
  const { settings, dispatchSettings } = useSettings();

  const form = useForm({
    defaultValues: { ...initialGridDataElementData },
  });

  const {
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isDirty, isSubmitSuccessful },
    handleSubmit,
  } = form;

  const editorProps = {
    control,
    setValue,
    getValues,
    watch,
    isSubmitSuccessful,
  };

  /* Reset the form to initial values when new/different
  gridDataElement data comes through */
  useEffect(() => {
    reset({ ...initialGridDataElementData });
  }, [reset, initialGridDataElementData]);

  /* Notify UpdatePage of isDirty status */
  useEffect(() => {
    dirtyFormCallback(isDirty);
  }, [isDirty, dirtyFormCallback]);

  /* 
  This handles the Save button. It prevents the html form submission
  See https://github.com/react-hook-form/react-hook-form/issues/1025#issuecomment-585652414
  */
  const onClickSaveButton = (e) => {
    e.preventDefault();
    handleSubmit(onSubmitValid, onSubmitError)(e); //curried
  };

  /* Handles when the form passes validation after submit. This function
  will check for an 'id' key or create a new one, then send the data
  back to UpdatePage for saving. */
  const onSubmitValid = (data) => {
    console.log("submitted data", data); //! DEBUG

    /* send to UpdatePage via callback. This the 
    Editor's gridDataElement's data */
    onSave(data);
  };

  const onSubmitError = (errors) => {};

  /* Track the toggle state of DemoBox collapsed status,
  helpful for setting debounce interval in Editor 
  i.e., if demobox is not visible, the debounce interval can be higher */
  const [demoBoxCollapsed, setDemoBoxCollapsed] = useState(
    !settings.show_demoBox
  );

  const handleToggleDemoBox = () => {
    setDemoBoxCollapsed((prevValue) => {
      dispatchSettings({
        type: "UPDATE",
        payload: {
          show_demoBox: prevValue,
        },
      });
      return !prevValue;
    });
  };

  /* 
  
  - - - - - - - - - RENDER/RETURN - - - - - - - - -
  
  */

  /* Renders the Toolbar associated with the Editor, includes
  Navigation arrows, Save, and Reset buttons */
  const renderToolbar = () => (
    <Toolbar variant="dense">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          minWidth: "235px",
        }}
      >
        <StyledNavigateIconButton
          disabled={isDirty}
          disableRipple
          onClick={() => onChangeGridDataElement(true)}
          size="large"
        >
          <NavigateBeforeIcon
            sx={{ fontSize: "4rem", textShadow: "shadows.1" }}
          />
        </StyledNavigateIconButton>
        <Typography variant="h1" sx={{ color: "grey.300" }}>
          {initialGridDataElementData.location || ""}
        </Typography>
        <StyledNavigateIconButton
          disabled={isDirty}
          disableRipple
          onClick={() => onChangeGridDataElement(false)}
          size="large"
        >
          <NavigateNextIcon sx={{ fontSize: "4rem" }} />
        </StyledNavigateIconButton>
      </Box>
      <Stack direction="row" spacing={1}>
        <ButtonStandard disabled={!isDirty} onClick={onClickSaveButton}>
          Save
        </ButtonStandard>
        <ButtonStandard
          disabled={!isDirty}
          secondary
          onClick={() => {
            reset();
          }}
        >
          Reset
        </ButtonStandard>
      </Stack>
    </Toolbar>
  );

  if (initialGridDataElementData) {
    return (
      <Grid container>
        <FormProvider {...form}>
          <Grid item xs={12}>
            <Tooltip
              title={demoBoxCollapsed ? "Show example" : "Hide example"}
              enterDelay={300}
            >
              <Switch
                checked={!demoBoxCollapsed}
                onChange={handleToggleDemoBox}
              />
            </Tooltip>
            <DemoBox collapsed={demoBoxCollapsed} />
          </Grid>
          <Grid item xs={12}>
            {renderToolbar()}
          </Grid>
          <Grid item xs={12}>
            <Editor {...editorProps} />
          </Grid>
          <Grid item xs={12}>
            {renderToolbar()}
          </Grid>
        </FormProvider>
      </Grid>
    );
  } else {
    return <></>;
  }
};

export default EditorController;
