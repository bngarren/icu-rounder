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
import BedspaceEditor from "./BedspaceEditor";
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
  defaultBedData,
  needsSave,
  setNeedsSave = (f) => f,
  onNextBedspace = (f) => f,
  onSave = (f) => f,
}) => {
  const { settings, dispatchSettings } = useSettings();
  /* Holds the Editor's own version of this bedspace's data
   */
  const [bedspaceEditorData, _setBedspaceEditorData] = useState(); // i.e. "Working" data

  /* Also keep a ref (for instances where a stale closure is a problem) */
  const bedspaceEditorDataRef = useRef(bedspaceEditorData);
  const setBedspaceEditorData = useCallback((data) => {
    _setBedspaceEditorData(data);
    bedspaceEditorDataRef.current = data;
  }, []);

  const [resetKey, setResetKey] = useState(uniqueId()); // value not important, just using it to trigger re-render

  /* Want to reset the data being used in the bedspaceEditor
  to the saved "truth" data, e.g., reset changes back to the 
  last saved state */
  const handleOnReset = useCallback(() => {
    setBedspaceEditorData(defaultBedData);
    setResetKey(uniqueId());
  }, [defaultBedData, setBedspaceEditorData]);

  /* Keep the editor's data up to date with the truth data */
  useEffect(() => {
    handleOnReset(); // this will make BedspaceEditorData = defaultBedData
    setNeedsSave(false);
  }, [defaultBedData, setNeedsSave, handleOnReset]);

  /* When a change in the BedspaceEditor's data occurs, it
  sends the new bedspace JSON object here.  */
  const handleOnEditorDataChange = useCallback(
    (newBedspaceData) => {
      setBedspaceEditorData(newBedspaceData);
    },
    [setBedspaceEditorData]
  );

  /* Track the toggle state of DemoBox collapsed status,
  helpful for setting debounce interval in BedspaceEditor 
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
          onSave(bedspaceEditorDataRef.current);
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

  /* Renders the Toolbar associated with the BedspaceEditor, includes
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
          onClick={() => onNextBedspace(true)}
          size="large"
        >
          <NavigateBeforeIcon
            sx={{ fontSize: "4rem", textShadow: "shadows.1" }}
          />
        </StyledNavigateIconButton>
        <Typography variant="h1" sx={{ color: "grey.300" }}>
          {defaultBedData.bed || ""}
        </Typography>
        <StyledNavigateIconButton
          disabled={needsSave}
          disableRipple
          onClick={() => onNextBedspace(false)}
          size="large"
        >
          <NavigateNextIcon sx={{ fontSize: "4rem" }} />
        </StyledNavigateIconButton>
      </Box>
      <Stack direction="row" spacing={1}>
        <ButtonStandard
          disabled={!needsSave}
          onClick={() => onSave(bedspaceEditorData)}
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

  if (bedspaceEditorData && defaultBedData) {
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
          <DemoBox data={bedspaceEditorData} collapsed={demoBoxCollapsed} />
        </Grid>
        <Grid item xs={12}>
          {bedspaceEditorData && renderToolbar()}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            ...(needsSave ? {} : {}),
          }}
        >
          <BedspaceEditor
            data={bedspaceEditorData}
            dataRef={bedspaceEditorDataRef}
            defaultValues={defaultBedData}
            onEditorDataChange={handleOnEditorDataChange}
            setNeedsSave={setNeedsSave}
            resetKey={resetKey}
            debounceInterval={demoBoxCollapsed ? 600 : 400}
          />
        </Grid>
        <Grid item xs={12}>
          {bedspaceEditorData && renderToolbar()}
        </Grid>
      </Grid>
    );
  } else {
    return <></>;
  }
};

export default DemoAndEditorController;
