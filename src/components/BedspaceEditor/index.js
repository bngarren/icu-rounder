import { useEffect, useState, useCallback, useRef, memo } from "react";

// MUI
import { Box, TextField, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';

import { usePopupState } from "material-ui-popup-state/hooks";

// Components
import EditorTextField from "./EditorTextField";
import CustomFormControlEditor from "../../components/CustomFormControl/CustomFormControlEditor";
import ToggleContentType from "../ToggleContentType";
import ContentInput from "../ContentInput";
import ContingencyInput from "./ContingencyInput";
import SnippetPopover from "../SnippetPopover";

// Context
import { useSettings } from "../../context/Settings";
import { useDebouncedContext } from "../../pages/UpdatePage/DebouncedContext";

// lodash
import { uniqueId, debounce } from "lodash";

// Util
import { getCursorPos, setCursorPos } from "../../utils/CursorPos";

const useStyles = makeStyles((theme) => ({
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

/* Styling */



const BedspaceEditor = ({
  data,
  dataRef,
  defaultValues,
  resetKey,
  onEditorDataChange = (f) => f,
  setNeedsSave = (f) => f,
  debounceInterval,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const { settings } = useSettings();

  /* For each input in the Editor, tracks whether it needs a save or not */
  const unsavedData = useRef([]);

  const setInputSavedStatus = useCallback(
    (id, unsaved) => {
      if (unsaved) {
        /* If this input is now 'unsaved', add to the unsavedData array, only
      if it doesn't already exist */
        if (unsavedData.current.indexOf(id) === -1) {
          unsavedData.current.push(id);
        }
      } else {
        /* If this input is now 'saved', remove it from the unsavedData array */
        unsavedData.current = unsavedData.current.filter(
          (value) => value !== id
        );
      }

      setNeedsSave(unsavedData.current.length > 0);
    },
    [setNeedsSave]
  );

  const clearUnsavedData = () => {
    unsavedData.current = [];
  };

  /* Callback sent as prop to each CustomFormControlEditor component so
  that this component knows when a change has occured that needs a save */
  const onDiffChange = useCallback(
    (id, diff) => {
      setInputSavedStatus(id, diff);
    },
    [setInputSavedStatus]
  );

  /* Ref to last name input field, so we can focus() here when a bed is selected */
  const lastNameInputRef = useRef();

  // Popover - using a hook from material-ui-popup-state package
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const lastCursorPos = useRef({
    pos: null,
    element: null,
  });

  /* When a new bedspace is selected...*/
  useEffect(() => {
    // Reset the unsavedData array because this new data shouldn't have any 'unsaved' status
    clearUnsavedData();

    // Focus on the lastName input
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

  // keeping the id helps us track this specific function in DebouncedContext
  const debouncedFunctionId = useRef(uniqueId("BedspaceEditor"));

  // the function we want to debounce
  debouncedOnEditorChangeFunction.current = (target, value) => {
    onEditorDataChange({
      ...dataRef.current, //* use ref here, otherwise stale closure
      [target]: value || "",
    });
  };

  // the debounced function
  const debouncedOnEditorChange =
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useCallback(
      debounce(
        debouncedOnEditorChangeFunction.current,
        debounceInterval, // time interval before allowing onEditorChange to fire
        { leading: true } // doesn't debounce the first time it's called
      ),
      []
    );

  const { addDebouncedFunction, removeDebouncedFunction } =
    useDebouncedContext();
  /* Add this debounced function to an array held by DebouncedContext so that it
    can be flushed/canceled if needed */
  useEffect(() => {
    const id = debouncedFunctionId.current;
    addDebouncedFunction(debouncedOnEditorChange, id);
    return () => {
      removeDebouncedFunction(id); // remove on dismount
    };
  }, [addDebouncedFunction, removeDebouncedFunction, debouncedOnEditorChange]);

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

  const handleInputOnBlur = useCallback(() => {
    debouncedOnEditorChange.flush();
  }, [debouncedOnEditorChange]);

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

  const handleOnToggleContentType = (target, value) => {
    handleInputChange(target, value);
  };

  /*  - - - - - RETURN - - - -  */
  if (data) {
    return (
      <Paper sx={{
        p: 1,
        backgroundColor: "transparent",
        boxShadow: "none",
      }}>
        <form
          autoComplete="off"
          spellCheck="false"
          key={resetKey}
        >
          {/* Box containing Bed, Names, and Team */}
          <Box sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "flex-start",
            gap: "4px",
          }}>
            <CustomFormControlEditor
              id="bed"
              initialValue={defaultValues.bed}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
              onBlur={handleInputOnBlur}
            >
              <EditorTextField
                label="Bed"
                size="small"
                inputSize={3}
              />
            </CustomFormControlEditor>
            <CustomFormControlEditor
              id="lastName"
              initialValue={defaultValues.lastName}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
              onBlur={handleInputOnBlur}
            >
              <EditorTextField
                label="Last Name"
                size="small"
                autoFocus
                inputRef={lastNameInputRef}
              />
            </CustomFormControlEditor>
            <CustomFormControlEditor
              id="firstName"
              initialValue={defaultValues.firstName}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
              onBlur={handleInputOnBlur}
            >
              <EditorTextField
                label="First Name"
                size="small"
              />
            </CustomFormControlEditor>
            <CustomFormControlEditor
              id="teamNumber"
              initialValue={defaultValues.teamNumber}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
              onBlur={handleInputOnBlur}
            >
              <EditorTextField
                label="Team"
                size="small"
                inputSize={10}
              />
            </CustomFormControlEditor>
          </Box>
          <Box>
            <CustomFormControlEditor
              id="oneLiner"
              initialValue={defaultValues.oneLiner}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
              onBlur={handleInputOnBlur}
            >
              <EditorTextField
                label="One Liner"
                multiline
                minRows={2}
                maxRows={4}
                fullWidth
              />
            </CustomFormControlEditor>
            <Box className={classes.contingenciesRoot}>
              <CustomFormControlEditor
                id="contingencies"
                initialValue={defaultValues.contingencies}
                onInputChange={handleInputChange}
                onDiffChange={onDiffChange}
                onBlur={handleInputOnBlur}
                onChangeArgument={1}
              >
                <ContingencyInput
                  options={settings.contingencyOptions}
                />
              </CustomFormControlEditor>
            </Box>
            <Box>
              <CustomFormControlEditor
                id={
                  data.contentType === "nested"
                    ? "nestedContent"
                    : "simpleContent"
                }
                initialValue={
                  data.contentType === "nested"
                    ? defaultValues.nestedContent || ""
                    : defaultValues.simpleContent || ""
                }
                onInputChange={handleInputChange}
                onDiffChange={onDiffChange}
                onBlur={handleInputOnBlur}
                onChangeArgument={data.contentType === "nested" ? 1 : 0}
              >
                {/* Pass the initialValue prop here as well, so that ContentInput
                  knows when to reset itself, i.e. after a bed change */}
                <ContentInput
                  initialValue={
                    data.contentType === "nested"
                      ? defaultValues.nestedContent || ""
                      : defaultValues.simpleContent || ""
                  }
                >
                  {/* The ToggleContentType component and its surrounding
                  CustomFormControlEditor will be passed as a child to
                  ContentInput so that it can be rendered in this layout */}
                  <CustomFormControlEditor
                    id="contentType"
                    initialValue={defaultValues.contentType || "simple"}
                    onInputChange={handleOnToggleContentType}
                    onDiffChange={onDiffChange}
                    onChangeArgument={1}
                  >
                    <ToggleContentType />
                  </CustomFormControlEditor>
                </ContentInput>
              </CustomFormControlEditor>
            </Box>

            <CustomFormControlEditor
              id="bottomText"
              initialValue={defaultValues.bottomText}
              onInputChange={handleInputChange}
              onDiffChange={onDiffChange}
              onBlur={handleInputOnBlur}
            >
              <EditorTextField
                label="Bottom Right Text"
                inputSize={30}
              />
            </CustomFormControlEditor>
          </Box>
        </form>
        <SnippetPopover popupState={popupState} onSelect={onSnippetSelected} />
      </Paper>
    );
  } else {
    return <></>;
  }
};

export default BedspaceEditor;
