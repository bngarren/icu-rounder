import { useEffect, useState, useCallback, useRef } from "react";
import { debounce } from "lodash";

import { TextField, Paper } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { getCursorPos, setCursorPos } from "../../utils/CursorPos";

import { usePopupState } from "material-ui-popup-state/hooks";
import SnippetPopover from "../SnippetPopover";

import ContingencyInput from "../ContingencyInput";

const useStyles = makeStyles((theme) => ({
  editorRoot: {
    padding: "10px",
    backgroundColor: "transparent",
  },
  form: {},
  textFieldRoot: {
    border: "1px solid #e2e2e1",
    overflow: "hidden",
    borderRadius: "3px",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
    "&$textFieldFocused": {
      backgroundColor: "#fff",
      borderColor: theme.palette.secondary.light,
    },
    paddingBottom: "2px",
  },
  textFieldFocused: {},
  textFieldInputLabelRoot: {
    color: theme.palette.secondary.main,
    fontSize: "11pt",
    "&$textFieldInputLabelFocused": {
      color: theme.palette.secondary.light,
    },
  },
  textFieldInputLabelFocused: {},
  textFieldBed: {
    margin: "2px",
    width: "75px",
  },
  textFieldLastNameFirstName: {
    margin: "2px",
  },
  textFieldTeam: {
    margin: "2px",
    width: "75px",
  },
  textFieldOneLiner: {
    margin: "2px",
    marginTop: "8px",
    width: "100%",
  },
  textFieldContingencies: {
    margin: "2px",
    marginTop: "8px",
  },
  textFieldBody: {
    margin: "2px",
    marginTop: "8px",
    width: "100%",
  },
  contingenciesRoot: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "2px",
    marginTop: "8px",
  },
  contingencyItem: {
    borderBottom: "1px solid gray",
    marginRight: "2px",
  },
}));

const CustomTextField = ({
  id,
  customStyle: classes,
  reset = false,
  forcedValue = "",
  sendInputChange = (f) => f,
  ...props
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(forcedValue);
  }, [forcedValue, reset]);

  const handleInputChange = (e, id) => {
    const val = e.target.value;

    setValue(val);

    sendInputChange(id, val);
  };

  return (
    <TextField
      onChange={(e) => handleInputChange(e, id)}
      value={value}
      InputProps={{
        classes: {
          root: classes.textFieldRoot,
          focused: classes.textFieldFocused,
        },
        disableUnderline: true,
        inputProps: {
          style: { fontSize: "10.5pt" },
        },
      }}
      InputLabelProps={{
        classes: {
          root: classes.textFieldInputLabelRoot,
          focused: classes.textFieldInputLabelFocused,
        },
      }}
      id={id}
      {...props}
    />
  );
};

const BedspaceEditor = ({
  data: propData,
  defaultValues,
  reset,
  onEditorDataChange = (f) => f,
  debounceInterval,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [editorData, _setEditorData] = useState();

  /* Create a ref and updater function to fix stale closure problem
  E.g., see debouncedOnEditorChange function  */
  const editorDataRef = useRef(editorData);
  const setEditorData = (data) => {
    editorDataRef.current = data;
    _setEditorData(data);
  };

  // Toggle this ref value to force a re-render in components with this passed as a prop
  // ! yes it's hacky
  const forceValue = useRef(false);
  const toggleForceValue = () => {
    forceValue.current = !forceValue.current;
  };

  /* Easily set all the forced values for our inputs with one function, passing in a 
  data object that has a value for each input field */
  const getForcedValues = (data) => {
    return (
      data && {
        bed: data.bed ? data.bed : "",
        lastName: data.lastName ? data.lastName : "",
        firstName: data.firstName ? data.firstName : "",
        teamNumber: data.teamNumber ? data.teamNumber : "",
        oneLiner: data.oneLiner ? data.oneLiner : "",
        contingencies: data.contingencies ? data.contingencies : [],
        body: data.body ? data.body : "",
      }
    );
  };

  /* These are the values we can reset our input fields to reflect, e.g,
  when default values need to be populated or the reset button is clicked */
  const forcedValues = useRef(getForcedValues(defaultValues));

  /* Ref to last name input field, so we can focus() here when a bed is selected */
  const lastNameInputRef = useRef();

  // Popover - using a hook from material-ui-popup-state package
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const lastCursorPos = useRef({
    pos: null,
    element: null,
  });

  /* When a new bedspace is selected by the user (in UpdatePage) or
   new bedspace data comes through as prop, update this component's
   state */
  useEffect(() => {
    // Update our editor's bedspace data (JSON object)
    setEditorData(propData);

    // Force out input fields to match this new truth data
    forcedValues.current = getForcedValues(propData);
  }, [propData]);

  /* When a new bedspace is selected or the reset button is clicked,
  the input fields need to be repopulated with the "default data" which is
  just the "truth"/saved data from UpdatePage */
  useEffect(() => {
    forcedValues.current = getForcedValues(defaultValues);
    toggleForceValue();
  }, [defaultValues, reset]);

  /* When a new bedspace is selected, focus() on the last name input */
  useEffect(() => {
    if (lastNameInputRef?.current) lastNameInputRef.current.focus();
  }, [defaultValues]);

  /* Since we don't want to run the onEditorDataChange function
  every time a keystroke is entered, we debounce it using lodash */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnEditorChange = useCallback(
    debounce((target, value) => {
      onEditorDataChange({
        ...editorDataRef.current, //* use ref here, otherwise stale closure
        [target]: value || "",
      });
    }, debounceInterval), // time interval before allowing onEditorChange to fire
    [onEditorDataChange]
  );

  /*  Handles the onChange callbacks for all these input fields */
  const handleInputChange = useCallback(
    (target, value) => {
      /* Will eventually send the data back to parent component (UpdatePage), but
      we use debounced function so that it doesn't happen every keystroke */
      debouncedOnEditorChange(target, value);
    },
    [debouncedOnEditorChange]
  );

  const addContingency = (value) => {
    debouncedOnEditorChange("contingencies", value);
  };

  /* The user has selected a snippet to insert */
  const onSnippetSelected = (snippet) => {
    // Insert the snippet at the position our caret was at when the snippet was chosen
    insertSnippet(
      snippet,
      lastCursorPos.current.element,
      lastCursorPos.current.pos
    );

    // Recalculate where our caret should be after the snippet is inserted
    lastCursorPos.current = {
      ...lastCursorPos.current,
      pos: {
        start: lastCursorPos.current.pos.start + snippet.length,
        end: lastCursorPos.current.pos.start + snippet.length,
      },
    };

    /* setTimeout is a hacky way to get the focus to work correctly... */
    window.setTimeout(() => {
      setCursorPos(
        document.getElementById(lastCursorPos.current.element.id),
        lastCursorPos.current.pos.start,
        lastCursorPos.current.pos.end
      );
    }, 0);
  };

  const insertSnippet = useCallback(
    (snippet, element, pos) => {
      let currentText = element.value;
      let newText =
        currentText.substring(0, pos.start) +
        snippet +
        currentText.substring(pos.end);
      handleInputChange(element.id, newText);
    },
    [handleInputChange]
  );

  /* How the snippet popover is triggered  */
  const handleKeyDown = useCallback(
    (event) => {
      let key = event.key;
      let element = document.activeElement;
      let elementId = element.id;

      if (key === "Control") {
        // do nothing when only Control key is pressed.
        return;
      }
      let keyIsSpacebar =
        key === " " ||
        key === "Space" ||
        key === "Spacebar" ||
        event.code === "Space";

      // this is the CTRL + SPACEBAR combination
      if (keyIsSpacebar && event.ctrlKey) {
        if (elementId === "oneLiner" || elementId === "body") {
          console.log(`Popover event triggered from element = ${elementId}`);

          // Don't let the CTRL or SPACEBAR keydown do anything else
          event.stopPropagation();

          /* Store the cursor position and HTML element from which the snippet popup
          was triggered so that we know where to insert the snippet */
          let pos = getCursorPos(element);
          lastCursorPos.current = { pos, element };

          popupState.open(element);
        }
      }
    },
    [popupState]
  );

  /* Key down listener to activate the Popover */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /*  - - - - - RETURN - - - -  */
  if (editorData) {
    return (
      <Paper className={classes.editorRoot}>
        <form className={classes.form} autoComplete="off" spellCheck="false">
          <div>
            <CustomTextField
              id="bed"
              className={classes.textFieldBed}
              label="Bed"
              variant="filled"
              reset={forceValue.current}
              forcedValue={forcedValues.current.bed}
              sendInputChange={handleInputChange}
              size="small"
              customStyle={classes}
            ></CustomTextField>
            <CustomTextField
              id="lastName"
              className={classes.textFieldLastNameFirstName}
              label="Last Name"
              variant="filled"
              reset={forceValue.current}
              forcedValue={forcedValues.current.lastName}
              sendInputChange={handleInputChange}
              size="small"
              customStyle={classes}
              autoFocus
              inputRef={lastNameInputRef}
            ></CustomTextField>
            <CustomTextField
              id="firstName"
              className={classes.textFieldLastNameFirstName}
              label="First Name"
              variant="filled"
              reset={forceValue.current}
              forcedValue={forcedValues.current.firstName}
              sendInputChange={handleInputChange}
              size="small"
              customStyle={classes}
            ></CustomTextField>
            <CustomTextField
              id="teamNumber"
              className={classes.textFieldTeam}
              label="Team"
              variant="filled"
              reset={forceValue.current}
              forcedValue={forcedValues.current.teamNumber}
              sendInputChange={handleInputChange}
              size="small"
              customStyle={classes}
            ></CustomTextField>
          </div>
          <div>
            <CustomTextField
              id="oneLiner"
              className={classes.textFieldOneLiner}
              label="One Liner"
              variant="filled"
              reset={forceValue.current}
              forcedValue={forcedValues.current.oneLiner}
              sendInputChange={handleInputChange}
              multiline
              rows={2}
              customStyle={classes}
            ></CustomTextField>
            <div className={classes.contingenciesRoot}>
              {
                <ContingencyInput
                  customStyle={classes}
                  reset={forceValue.current}
                  forcedValue={forcedValues.current.contingencies}
                  sendInputChange={handleInputChange}
                />
              }
            </div>
            <CustomTextField
              id="body"
              className={classes.textFieldBody}
              label="Content"
              variant="filled"
              reset={forceValue.current}
              forcedValue={forcedValues.current.body}
              sendInputChange={handleInputChange}
              multiline
              rows={10}
              customStyle={classes}
            ></CustomTextField>
          </div>
        </form>
        <SnippetPopover popupState={popupState} onSelect={onSnippetSelected} />
      </Paper>
    );
  } else {
    return <></>;
  }
};

export default BedspaceEditor;
