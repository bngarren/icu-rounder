import { useEffect, useState, useCallback, useRef } from "react";
import { debounce } from "lodash";

import { TextField, Paper } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { getCursorPos, setCursorPos } from "../../utils/CursorPos";

import { usePopupState } from "material-ui-popup-state/hooks";
import SnippetPopover from "../SnippetPopover";

// Components
import CustomFormControlEditor from "../../components/CustomFormControl/CustomFormControlEditor";
import ContingencyInput from "../ContingencyInput";

// Settings context
import { useSettings } from "../../context/Settings";
import { ContactsOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  editorRoot: {
    padding: "10px",
    backgroundColor: "transparent",
    boxShadow: "none",
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
  textFieldBottomText: {
    width: "100%",
    margin: "2px",
    marginTop: "8px",
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

const CustomTextField = ({ id, customStyle: classes, ...props }) => {
  return (
    <TextField
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
  setNeedsSave = (f) => f,
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

  /* For each input in the Editor, tracks whether it needs a save or not */
  const [unsavedData, _setUnsavedData] = useState([]);

  const setInputSavedStatus = (id, unsaved) => {
    if (unsaved) {
      /* If this input is now 'unsaved', add to the unsavedData array, only
      if it doesn't already exist */
      _setUnsavedData((prevValue) => {
        if (prevValue.indexOf(id) === -1) {
          prevValue.push(id);
          return prevValue;
        } else {
          return prevValue;
        }
      });
    } else {
      /* If this input is now 'saved', remove it from the unsavedData array */
      _setUnsavedData((prevValue) => {
        return prevValue.filter((value) => value !== id);
      });
    }
  };

  /* If the Editor is aware of the unsavedData array changing, let the parent component know */
  useEffect(() => {
    setNeedsSave(unsavedData.length > 0);
  }, [unsavedData.length]);

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
  }, [propData]);

  /* When a new bedspace is selected, focus() on the last name input */
  useEffect(() => {
    if (lastNameInputRef?.current) lastNameInputRef.current.focus();
  }, [defaultValues]);

  /* 
  
  Since we don't want to run the onEditorDataChange function
  every time a keystroke is entered, we debounce it using lodash 
  
  We use a ref to memoize the debounced function so that the function is only created
  once, but avoids stale data

  This stores the current instance of the function to be debounced in a ref,
  and updates it every render (preventing stale data). Instead of
  debouncing that function directly, though, we debounce a wrapper function
  that reads the current version from the ref and calls it.

  https://stackoverflow.com/questions/59183495/cant-get-lodash-debounce-to-work-properly-executed-multiple-times-reac


  */

  const debouncedOnEditorChangeFunction = useRef();

  // the function we want to debounce
  debouncedOnEditorChangeFunction.current = (target, value) => {
    onEditorDataChange({
      ...editorDataRef.current, //* use ref here, otherwise stale closure
      [target]: value || "",
    });
  };

  // the debounced function
  const debouncedOnEditorChange = useCallback(
    debounce(
      debouncedOnEditorChangeFunction.current,
      debounceInterval, // time interval before allowing onEditorChange to fire
      { leading: true } // doesn't debounce the first time it's called
    ),
    []
  );

  /*  Handles the onInputChange callbacks for all the inputs, via a prop
  passed through CustomFormControlEditor component which wraps the input */
  const handleInputChange = useCallback(
    (target, value) => {
      /* Will eventually send the data back to parent component (UpdatePage), but
      we use debounced function so that it doesn't happen every keystroke */
      debouncedOnEditorChange(target, value);
    },
    [debouncedOnEditorChange]
  );

  /* Callback sent as prop to each CustomFormControlEditor component so
  that this component knows when a change has occured that needs a save */
  const onDiffChange = useCallback((id, diff) => {
    setInputSavedStatus(id, diff);
  }, []);

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
            <CustomFormControlEditor
              id="bed"
              initialValue={defaultValues.bed || ""}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
            >
              <CustomTextField
                className={classes.textFieldBed}
                label="Bed"
                variant="filled"
                size="small"
                customStyle={classes}
              />
            </CustomFormControlEditor>
            <CustomFormControlEditor
              id="lastName"
              initialValue={defaultValues.lastName || ""}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
            >
              <CustomTextField
                className={classes.textFieldLastNameFirstName}
                label="Last Name"
                variant="filled"
                size="small"
                customStyle={classes}
                autoFocus
                inputRef={lastNameInputRef}
              />
            </CustomFormControlEditor>
            <CustomFormControlEditor
              id="firstName"
              initialValue={defaultValues.firstName || ""}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
            >
              <CustomTextField
                className={classes.textFieldLastNameFirstName}
                label="First Name"
                variant="filled"
                size="small"
                customStyle={classes}
              />
            </CustomFormControlEditor>
            <CustomFormControlEditor
              id="teamNumber"
              initialValue={defaultValues.teamNumber || ""}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
            >
              <CustomTextField
                className={classes.textFieldTeam}
                label="Team"
                variant="filled"
                size="small"
                customStyle={classes}
              />
            </CustomFormControlEditor>
          </div>
          <div>
            <CustomFormControlEditor
              id="oneLiner"
              initialValue={defaultValues.oneLiner || ""}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
            >
              <CustomTextField
                className={classes.textFieldOneLiner}
                label="One Liner"
                variant="filled"
                multiline
                rows={2}
                customStyle={classes}
              />
            </CustomFormControlEditor>
            <div className={classes.contingenciesRoot}>
              {/* <ContingencyInput
                  customStyle={classes}
                  options={settings.contingencyOptions}
                /> */}
            </div>
            <CustomFormControlEditor
              id="body"
              initialValue={defaultValues.body || ""}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
            >
              <CustomTextField
                className={classes.textFieldBody}
                label="Content"
                variant="filled"
                multiline
                rows={10}
                customStyle={classes}
              />
            </CustomFormControlEditor>
            <CustomFormControlEditor
              id="bottomText"
              initialValue={defaultValues.bottomText || ""}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
            >
              <CustomTextField
                className={classes.textFieldBottomText}
                label="Bottom Right Text"
                variant="filled"
                customStyle={classes}
              />
            </CustomFormControlEditor>
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
