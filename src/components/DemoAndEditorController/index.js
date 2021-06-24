import { useState, useEffect, createContext, useRef, useCallback } from "react";
import {
  Grid,
  Button,
  Toolbar,
  Typography,
  Switch,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

// Lodash
import { uniqueId } from "lodash";

// Components
import DemoBox from "../../components/DemoBox";
import BedspaceEditor from "../../components/BedspaceEditor";

// Style
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0 1vw",
    justifyContent: "center",
  },
  bedspaceEditorToolbar: {
    borderBottom: "2px solid #f6f8fa",
  },
  navigationDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: "235px",
  },
  bedspaceEditorToolbarBedNumber: {
    color: "#8c888821",
  },
  navigateIconButton: {
    color: theme.palette.secondary.veryLight,
    padding: 5,
    "&:hover": {
      color: theme.palette.secondary.light,
      cursor: "pointer",
      backgroundColor: "transparent",
    },
  },
  navigateIcon: {
    fontSize: "50px",
  },
  saveButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
    marginRight: "3px",
  },
  saveButtonDisabled: {
    backgroundColor: "#f4f4f466",
  },
  resetButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
    },
    marginRight: "3px",
  },
  resetButtonDisabled: {
    backgroundColor: "#f4f4f466",
  },
  bedspaceEditorGridItem: {
    background: "white",
  },
  bedspaceEditorGridItemNeedsSave: {
    background:
      "repeating-linear-gradient( -45deg, #017c820a, #017c820a 10px, #fff0 5px, #0000 20px )",
  },
}));

const DemoAndEditorController = ({
  defaultBedData,
  needsSave,
  setNeedsSave = (f) => f,
  onNextBedspace = (f) => f,
  onSave = (f) => f,
}) => {
  const classes = useStyles();

  /* Holds the Editor's own version of this bedspace's data
   */
  const [bedspaceEditorData, _setBedspaceEditorData] = useState(); // i.e. "Working" data

  /* Also keep a ref (for instances where a stale closure is a problem) */
  const bedspaceEditorDataRef = useRef(bedspaceEditorData);
  const setBedspaceEditorData = (data) => {
    _setBedspaceEditorData(data);
    bedspaceEditorDataRef.current = data;
  };

  const [resetKey, setResetKey] = useState(uniqueId()); // value not important, just using it to trigger re-render

  /* Want to reset the data being used in the bedspaceEditor
  to the saved "truth" data, e.g., reset changes back to the 
  last saved state */
  const handleOnReset = useCallback(() => {
    setBedspaceEditorData(defaultBedData);
    setResetKey(uniqueId());
  }, [defaultBedData]);

  /* Keep the editor's data up to date with the truth data */
  useEffect(() => {
    handleOnReset(); // this will make BedspaceEditorData = defaultBedData
    setNeedsSave(false);
  }, [defaultBedData, setNeedsSave, handleOnReset]);

  /* When a change in the BedspaceEditor's data occurs, it
  sends the new bedspace JSON object here.  */
  const handleOnEditorDataChange = useCallback((newBedspaceData) => {
    setBedspaceEditorData(newBedspaceData);
  }, []);

  /* Track the toggle state of DemoBox collapsed status,
  helpful for setting debounce interval in BedspaceEditor 
  i.e., if demobox is not visible, the debounce interval can be higher */
  const [demoBoxCollapsed, setDemoBoxCollapsed] = useState(true);

  /* A ref to hold any debounced functions being used.
  These will be flushed when necessary.
  Example: When we try to save DURING a debounce, we first need to flush
  to get the rest of the data in, before taking any actions */
  const debouncedFunctions = useRef([]);

  /* Give this to child components so they can add their debounced functions */
  const addDebouncedFunction = useCallback((f) => {
    debouncedFunctions.current.push(f);
    console.log(debouncedFunctions.current);
    return f;
  }, []);

  /* For each debounced function in the array, flush it--meaning
  invoke it now without waiting for delay */
  const flushDebouncedFunctions = () => {
    debouncedFunctions.current.forEach((f) => {
      try {
        f.flush();
      } catch (err) {
        console.error(err);
      }
    });
  };

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
          flushDebouncedFunctions(); //ensure all debounced functions are finalized before saving
          onSave(bedspaceEditorDataRef.current);
        }
      }
    },
    [needsSave, onSave]
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
    <Toolbar variant="dense" className={classes.bedspaceEditorToolbar}>
      <div className={classes.navigationDiv}>
        <IconButton
          disabled={needsSave}
          className={classes.navigateIconButton}
          disableRipple
          onClick={() => onNextBedspace(true)}
        >
          <NavigateBeforeIcon className={classes.navigateIcon} />
        </IconButton>
        <Typography
          variant="h1"
          className={classes.bedspaceEditorToolbarBedNumber}
        >
          {defaultBedData.bed || ""}
        </Typography>
        <IconButton
          disabled={needsSave}
          className={classes.navigateIconButton}
          disableRipple
          onClick={() => onNextBedspace(false)}
        >
          <NavigateNextIcon className={classes.navigateIcon} />
        </IconButton>
      </div>
      <Button
        classes={{
          root: classes.saveButton,
          disabled: classes.saveButtonDisabled,
        }}
        size="small"
        disabled={!needsSave}
        onClick={() => onSave(bedspaceEditorData)}
      >
        Save
      </Button>
      <Button
        classes={{
          root: classes.resetButton,
          disabled: classes.resetButtonDisabled,
        }}
        size="small"
        disabled={!needsSave}
        onClick={(e) => handleOnReset(e)}
      >
        Reset
      </Button>
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
              color="secondary"
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
          className={
            needsSave
              ? classes.bedspaceEditorGridItemNeedsSave
              : classes.bedspaceEditorGridItem
          }
        >
          <BedspaceEditor
            data={bedspaceEditorData}
            dataRef={bedspaceEditorDataRef}
            defaultValues={defaultBedData}
            onEditorDataChange={handleOnEditorDataChange}
            setNeedsSave={setNeedsSave}
            resetKey={resetKey}
            addDebouncedFunction={addDebouncedFunction}
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
