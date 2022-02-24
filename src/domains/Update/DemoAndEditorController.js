import { useState, useEffect, useRef, useCallback } from "react";

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

// Lodash
import { uniqueId } from "lodash-es";

// Components
import DemoBox from "./DemoBox";
import Editor from "./Editor";
import { ButtonStandard } from "../../components";

// Context
import { useDebouncedContext } from "./DebouncedContext";
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

const DemoAndEditorController = ({
  defaultGridDataElementData,
  needsSave,
  setNeedsSave = (f) => f,
  onChangeGridDataElement = (f) => f,
  onSave = (f) => f,
}) => {
  const { settings, dispatchSettings } = useSettings();

  /* Holds the Editor's own version of this gridDataElements's data*/
  const [editorData, _setEditorData] = useState(); // i.e. "Working" data

  /* Also keep a ref (for instances where a stale closure is a problem) */
  const editorDataRef = useRef(editorData);
  const setEditorData = useCallback((data) => {
    _setEditorData(data);
    editorDataRef.current = data;
  }, []);

  const [resetKey, setResetKey] = useState(uniqueId()); // value not important, just using it to trigger re-render

  /* Want to reset the data being used in the Editor
  to the saved "truth" data, e.g., reset changes back to the 
  last saved state */
  const handleOnReset = useCallback(() => {
    setEditorData(defaultGridDataElementData);
    setResetKey(uniqueId());
  }, [defaultGridDataElementData, setEditorData]);

  /* Keep the Editor's data up to date with the truth data,
  i.e. gridDataElement data from GridState */
  useEffect(() => {
    handleOnReset(); // this will make EditorData = defaultGridDataElementData
    setNeedsSave(false);
  }, [defaultGridDataElementData, setNeedsSave, handleOnReset]);

  /* When a change in the Editor's data occurs, it
  sends the new/modified/fresh gridDataElement data object here.  */
  const handleOnEditorDataChange = useCallback(
    (freshGridDataElementData) => {
      setEditorData(freshGridDataElementData);
    },
    [setEditorData]
  );

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

  /* Grab the flushAll() function so that we can flush all the debounced functions 
  before quick saving with CTRL+S */
  const { flushAll } = useDebouncedContext();

  /* 
  - - - HOTKEYS - - - 
  
  Using this to activate a SAVE action with CTRL + S */
  const handleKeyDown = useCallback(
    (event) => {
      const key = event.key;
      if (key === "Control") {
        // do nothing when only Control key is pressed.
        return;
      }
      const keyIsS = key === "s";

      // this is the CTRL + S combination
      if (keyIsS && event.ctrlKey) {
        event.preventDefault(); // don't let the browser do the typical CTRL+S action
        /* If there is data that needsSave, do the save function */
        if (needsSave) {
          flushAll(); //ensure all debounced functions are finalized before saving
          onSave(editorDataRef.current);
        }
      }
    },
    [needsSave, onSave, flushAll]
  );

  /* Keydown listener */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
          disabled={needsSave}
          disableRipple
          onClick={() => onChangeGridDataElement(true)}
          size="large"
        >
          <NavigateBeforeIcon
            sx={{ fontSize: "4rem", textShadow: "shadows.1" }}
          />
        </StyledNavigateIconButton>
        <Typography variant="h1" sx={{ color: "grey.300" }}>
          {defaultGridDataElementData.location || ""}
        </Typography>
        <StyledNavigateIconButton
          disabled={needsSave}
          disableRipple
          onClick={() => onChangeGridDataElement(false)}
          size="large"
        >
          <NavigateNextIcon sx={{ fontSize: "4rem" }} />
        </StyledNavigateIconButton>
      </Box>
      <Stack direction="row" spacing={1}>
        <ButtonStandard
          disabled={!needsSave}
          onClick={() => onSave(editorData)}
        >
          Save
        </ButtonStandard>
        <ButtonStandard
          disabled={!needsSave}
          secondary
          onClick={(e) => handleOnReset(e)}
        >
          Reset
        </ButtonStandard>
      </Stack>
    </Toolbar>
  );

  if (editorData && defaultGridDataElementData) {
    return (
      <Grid container>
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
          <DemoBox data={editorData} collapsed={demoBoxCollapsed} />
        </Grid>
        <Grid item xs={12}>
          {editorData && renderToolbar()}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ...(needsSave ? {} : {}),
          }}
        >
          {
            <Editor
              data={editorData}
              dataRef={editorDataRef}
              defaultValues={defaultGridDataElementData}
              onEditorDataChange={handleOnEditorDataChange}
              setNeedsSave={setNeedsSave}
              resetKey={resetKey}
              debounceInterval={demoBoxCollapsed ? 600 : 400}
            />
          }
        </Grid>
        <Grid item xs={12}>
          {editorData && renderToolbar()}
        </Grid>
      </Grid>
    );
  } else {
    return <></>;
  }
};

export default DemoAndEditorController;
