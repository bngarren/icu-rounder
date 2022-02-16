import { useState, useEffect, useRef, useCallback } from "react";

// MUI
import {
  Grid,
  Box,
  Button,
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
import { uniqueId } from "lodash";

// Components
import DemoBox from "./DemoBox";
import BedspaceEditor from "./BedspaceEditor";

// Context
import { useDebouncedContext } from "./DebouncedContext";

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

// for Save and Reset
const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "save",
})(({ save, theme }) => ({
  fontSize: "0.85rem",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  ...(save && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.light,
  }),
  "&.Mui-disabled": {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.grey[500],
  },
  "&:hover": {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
  },
  marginRight: "3px",
}));

const DemoAndEditorController = ({
  defaultBedData,
  needsSave,
  setNeedsSave = (f) => f,
  onNextBedspace = (f) => f,
  onSave = (f) => f,
}) => {
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
  const [demoBoxCollapsed, setDemoBoxCollapsed] = useState(true);

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
      <StyledButton
        size="small"
        disabled={!needsSave}
        onClick={() => onSave(bedspaceEditorData)}
        save
      >
        Save
      </StyledButton>
      <StyledButton
        size="small"
        disabled={!needsSave}
        onClick={(e) => handleOnReset(e)}
      >
        Reset
      </StyledButton>
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
              onChange={() => setDemoBoxCollapsed((prevValue) => !prevValue)}
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
