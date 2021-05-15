import { useEffect, useState, useCallback, useRef } from "react";
import { debounce } from "lodash";

import { Grid, TextField, Button, Popover } from "@material-ui/core";
import { makeStyles, fade } from "@material-ui/core/styles";

import { getCursorPos, setCursorPos } from "../../utils/CursorPos";

import { usePopupState, bindTrigger } from "material-ui-popup-state/hooks";
import SnippetPopover from "../SnippetPopover";

const useStyles = makeStyles({
  editorRoot: {
    padding: "10px",
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
      borderColor: "#b7d100",
    },
  },
  textFieldFocused: {},
  textFieldInputLabelRoot: {
    color: "#9caa3d",
    fontSize: "11pt",
    "&$textFieldInputLabelFocused": {
      color: "#094D92",
    },
  },
  textFieldInputLabelFocused: {},
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
  textFieldBody: {
    margin: "2px",
    marginTop: "8px",
    width: "100%",
  },
});

const BedspaceEditor = ({
  data: propData,
  defaultValues,
  needsSave,
  onEditorDataChange = (f) => f,
}) => {
  const classes = useStyles();
  const [editorData, _setEditorData] = useState();

  /* Create a ref and updater function to fix stale closure problem
  E.g., see debouncedOnEditorChange function  */
  const editorDataRef = useRef(editorData);
  const setEditorData = (data) => {
    editorDataRef.current = data;
    _setEditorData(data);
  };

  const [inputValues, _setInputValues] = useState({
    lastName: defaultValues ? defaultValues.lastName : "",
    firstName: defaultValues ? defaultValues.firstName : "",
    teamNumber: defaultValues ? defaultValues.teamNumber : "",
    oneLiner: defaultValues ? defaultValues.oneLiner : "",
    body: defaultValues ? defaultValues.body : "",
  });

  /* Copy the inputValues state to a ref so that our event handler can 
  have access to the up-to-date state as well
  see: https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559 */
  const inputValuesRef = useRef(inputValues);
  // Update state and the ref at the same time to keep them in sync
  const setInputValues = (data) => {
    inputValuesRef.current = data;
    _setInputValues(data);
  };

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
  }, [propData]);

  /* Need to manually set the values of all these input fields
  when a new bedspace is selected (in UpdatePage) or when the Reset
  button is hit (set all the input field values to the "truth" data) 
  
  Using the needsSave prop (boolean) as a trigger, so that when the reset
  button is hit, needsSave is flipped to false, and the input fields are reset
  to default values
  */
  useEffect(() => {
    if (needsSave) return;

    // Update our controlled form fields
    setInputValues({
      lastName: defaultValues.lastName || "",
      firstName: defaultValues.firstName || "",
      teamNumber: defaultValues.teamNumber || "",
      oneLiner: defaultValues.oneLiner || "",
      body: defaultValues.body || "",
    });
  }, [defaultValues, needsSave]);

  /* Since we don't want to run the onEditorDataChange function
  every time a keystroke is entered, we debounce it using lodash */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnEditorChange = useCallback(
    debounce((target, value) => {
      onEditorDataChange({
        ...editorDataRef.current, //* use ref here, otherwise stale closure
        [target]: value || "",
      });
    }, 500), // time interval before allowing onEditorChange to fire
    [onEditorDataChange]
  );

  /*  Handles the onChange callbacks for all these input fields */
  const handleInputChange = useCallback(
    (target, value) => {
      switch (target) {
        case "lastName":
          setInputValues({ ...inputValues, lastName: value || "" });
          break;
        case "firstName":
          setInputValues({ ...inputValues, firstName: value || "" });
          break;
        case "teamNumber":
          setInputValues({ ...inputValues, teamNumber: value || "" });
          break;
        case "oneLiner":
          setInputValues({ ...inputValues, oneLiner: value || "" });
          break;
        case "body":
          setInputValues({ ...inputValues, body: value || "" });
          break;
        default:
      }

      /* Will eventually send the data back to parent component (UpdatePage), but
      we use debounced function so that it doesn't happen every keystroke */
      debouncedOnEditorChange(target, value);
    },
    [debouncedOnEditorChange, inputValues] //! Really don't want this memoization to change because inputValues change...
  );

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
        document.getElementById(lastCursorPos.current.element),
        lastCursorPos.current.pos.start,
        lastCursorPos.current.pos.end
      );
    }, 0);
  };

  const insertSnippet = useCallback(
    (snippet, target, pos) => {
      let currentText = inputValuesRef.current[target];
      let newText =
        currentText.substring(0, pos.start) +
        snippet +
        currentText.substring(pos.end);
      handleInputChange(target, newText);
    },
    [handleInputChange]
  );

  /* How the snippet popover is triggered  */
  const handleKeyDown = useCallback(
    (event) => {
      let key = event.key;
      let element = document.activeElement.id;

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
        console.log(document.activeElement);
        if (element === "oneLiner" || element === "body") {
          console.log("Popover event.");
          event.preventDefault();
          let pos = getCursorPos(document.activeElement);

          lastCursorPos.current = { pos, element };

          popupState.open(document.activeElement);
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

  return (
    <div className={classes.editorRoot}>
      <form className={classes.form} autoComplete="off" spellCheck="false">
        <div>
          <CustomTextField
            className={classes.textFieldLastNameFirstName}
            label="Last Name"
            variant="filled"
            value={inputValues.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            size="small"
            customStyle={classes}
          ></CustomTextField>
          <CustomTextField
            className={classes.textFieldLastNameFirstName}
            label="First Name"
            variant="filled"
            value={inputValues.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            size="small"
            customStyle={classes}
          ></CustomTextField>
          <CustomTextField
            className={classes.textFieldTeam}
            label="Team"
            variant="filled"
            value={inputValues.teamNumber}
            onChange={(e) => handleInputChange("teamNumber", e.target.value)}
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
            value={inputValues.oneLiner}
            onChange={(e) => handleInputChange("oneLiner", e.target.value)}
            multiline
            rows={2}
            customStyle={classes}
          ></CustomTextField>
          <CustomTextField
            id="body"
            className={classes.textFieldBody}
            label="Content"
            variant="filled"
            value={inputValues.body}
            onChange={(e) => handleInputChange("body", e.target.value)}
            multiline
            rows={10}
            customStyle={classes}
          ></CustomTextField>
        </div>
      </form>
      <SnippetPopover popupState={popupState} onSelect={onSnippetSelected} />
    </div>
  );
};

const CustomTextField = ({ customStyle: classes, ...props }) => {
  return (
    <TextField
      InputProps={{
        classes: {
          root: classes.textFieldRoot,
          focused: classes.textFieldFocused,
        },
        disableUnderline: true,
        inputProps: {
          style: { fontSize: "11pt" },
        },
      }}
      InputLabelProps={{
        classes: {
          root: classes.textFieldInputLabelRoot,
          focused: classes.textFieldInputLabelFocused,
        },
      }}
      {...props}
    />
  );
};

export default BedspaceEditor;
