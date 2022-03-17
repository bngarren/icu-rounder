import { useState, useEffect, useCallback, useRef } from "react";

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

// Hotkeys
import useHotkey from "../../hooks/useHotkey";

// Components
import DemoBox from "./DemoBox";
import Editor from "./Editor";
import { ButtonStandard } from "../../components";

// Context
import { useSettings } from "../../context/Settings";

// Util
import { APP_TEXT } from "../../utils";

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

  const gridDataElementId = useRef(initialGridDataElementData?.id);

  const form = useForm({
    defaultValues: { ...initialGridDataElementData },
  });

  const {
    control,
    reset,
    formState: { isDirty, isSubmitted, isSubmitting, isSubmitSuccessful },
    handleSubmit,
  } = form;

  /* Reset the form to initial values when new/different
  gridDataElement data comes through */
  useEffect(() => {
    /* Dont reset anything if currently submitting form */
    if (!isSubmitting) {
      /* A new gridDataElement has been selected and passed in */
      if (gridDataElementId.current !== initialGridDataElementData.id) {
        reset({ ...initialGridDataElementData });
        gridDataElementId.current = initialGridDataElementData.id;
      }
    }
  }, [reset, initialGridDataElementData, isSubmitting]);

  /* Reset the formstate after a submit is successful */
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...initialGridDataElementData }, { keepSubmitCount: true });
    }
  }, [reset, initialGridDataElementData, isSubmitted, isSubmitSuccessful]);

  /* Notify UpdatePage of isDirty status */
  useEffect(() => {
    dirtyFormCallback(isDirty);
  }, [isDirty, dirtyFormCallback]);

  /* The save process can be initiated by save button click or hotkey */
  const onSaveInitiation = (e) => {
    handleSubmit(
      onSubmitValid,
      onSubmitError
    )(e).catch((error) => {
      console.warn("Save was aborted.", error);
    }); //curried
  };

  /* Handles when the form passes validation after submit. This function
  will check for an 'id' key or create a new one, then send the data
  back to UpdatePage for saving. */
  const onSubmitValid = useCallback(
    async (data) => {
      console.log("submitted data", data); //! DEBUG

      /* Send to UpdatePage for saving via "onSave" callback. "data" is the Editor's gridDataElement's data */
      let res = await onSave(data);
      if (!res) {
        throw new Error(
          "unsuccessful save (could be error or canceled by the user)"
        );
      }
    },
    [onSave]
  );

  const onSubmitError = useCallback((errors) => {}, []);

  /* 
  This handles the Save button. It prevents the html form submission
  See https://github.com/react-hook-form/react-hook-form/issues/1025#issuecomment-585652414
  */
  const onClickSaveButton = (e) => {
    e.preventDefault();
    onSaveInitiation();
  };

  /* Perform the form submit when the hotkey save action fires */
  const handleHotkeySave = (e) => {
    e.preventDefault();
    /* Only try to submit form if form is dirty */
    if (isDirty) {
      onSaveInitiation(e);
    }
  };

  /* Register the save hotkey. The callback is memoized within, but
  we pass isDirty as a dependency array to avoid stale closure. */
  useHotkey("saveGridData", handleHotkeySave, null, [
    isDirty,
    onSaveInitiation,
  ]);

  /* DemoBox show/hide */
  /* Track the toggle state of DemoBox */
  const [demoBoxCollapsed, setDemoBoxCollapsed] = useState(
    !settings.show_demoBox
  );

  /* Update the user settings when DemoBox toggle changes */
  useEffect(() => {
    dispatchSettings({
      type: "UPDATE",
      payload: {
        show_demoBox: !demoBoxCollapsed,
      },
    });
  }, [demoBoxCollapsed, dispatchSettings]);

  const handleToggleDemoBox = () => {
    setDemoBoxCollapsed((prevValue) => {
      return !prevValue;
    });
  };

  /* Register the hotkey for DemoBox toggle */
  useHotkey(
    "toggleDemoBox",
    (e) => {
      e.preventDefault();
      handleToggleDemoBox();
    },
    null
  );

  /* Register the hotkeys for navigation 
  
  Set the enableOnTags prop to empty array so that this hotkey doesn't
  fire when an input is being typed in */
  useHotkey(
    "navigateNextGridDataElement",
    (e) => {
      e.preventDefault();
      onChangeGridDataElement(false);
    },
    { enableOnTags: [] }
  );

  useHotkey(
    "navigatePreviousGridDataElement",
    (e) => {
      e.preventDefault();
      onChangeGridDataElement(true);
    },
    { enableOnTags: [] }
  );

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
          {APP_TEXT.editorSave}
        </ButtonStandard>
        <ButtonStandard
          disabled={!isDirty}
          secondary
          onClick={() => {
            reset();
          }}
        >
          {APP_TEXT.editorReset}
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
              title={
                (demoBoxCollapsed
                  ? APP_TEXT.showDemoBox
                  : APP_TEXT.hideDemoBox) +
                ` (${settings.hotkeys.toggleDemoBox})`
              }
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
            <Editor control={control} />
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

/* EditorController.whyDidYouRender = {
  logOnDifferentValues: true,
}; */

export default EditorController;
