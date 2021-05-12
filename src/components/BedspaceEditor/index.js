import { useEffect, useState } from "react";

import {
  makeStyles,
  Grid,
  TextField,
  Button,
  Popover,
} from "@material-ui/core";

import { getCursorPos, setCursorPos } from "../../utils/CursorPos";

const useStyles = makeStyles({
  editorRoot: {
    padding: "10px",
  },
  form: {},
  textFieldLastNameFirstName: {
    margin: "2px",
  },
  textFieldTeam: {
    margin: "2px",
    width: "40px",
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
  onEditorDataChange = (f) => f,
}) => {
  const classes = useStyles();
  const [editorData, setEditorData] = useState();

  const [inputLastNameValue, setInputLastNameValue] = useState(
    defaultValues ? defaultValues.lastName : ""
  );
  const [inputFirstNameValue, setInputFirstNameValue] = useState(
    defaultValues ? defaultValues.firstName : ""
  );
  const [inputTeamNumberValue, setInputTeamNumberValue] = useState(
    defaultValues ? defaultValues.teamNumber : ""
  );
  const [inputOneLinerValue, setInputOneLinerValue] = useState(
    defaultValues ? defaultValues.oneLiner : ""
  );
  const [inputBodyValue, setInputBodyValue] = useState(
    defaultValues ? defaultValues.body : ""
  );

  //Popover
  const [anchorEl, setAnchorEl] = useState(null);

  /* Anytime a new bedspace is selected by the user or
   new bedspace data comes through as prop, update this component's
   state */
  useEffect(() => {
    // Update our editor's bedspace data (JSON object)
    setEditorData(propData);
  }, [propData]);

  /* Also when a new bedspace is selected, reinitialize all of
  our form fields to reflect the correct default values */
  useEffect(() => {
    // Update our controlled form fields
    setInputLastNameValue(defaultValues.lastName || "");
    setInputFirstNameValue(defaultValues.firstName || "");
    setInputTeamNumberValue(defaultValues.teamNumber || "");
    setInputOneLinerValue(defaultValues.oneLiner || "");
    setInputBodyValue(defaultValues.body || "");
  }, [defaultValues]);

  /* Key down listener to activate the Popover */
  useEffect(() => {
    document.addEventListener(
      "keydown",
      (event) => {
        let key = event.key;
        console.log(`key up = ${key}`);

        // this is the $ key
        if (key === "$" && event.shiftKey) {
          console.log(document.activeElement);
          if (
            document.activeElement.id === "oneLiner" ||
            document.activeElement.id === "body"
          ) {
            console.log("Popover event.");
            let pos = getCursorPos(document.activeElement);
            console.log(`cursor start = ${pos.start}`);
          }
        }
      },
      false
    );
  }, []);

  const handleInputChange = (target, event) => {
    const value = event.target.value;
    switch (target) {
      case "lastName":
        setInputLastNameValue(value || "");
        break;
      case "firstName":
        setInputFirstNameValue(value || "");
        break;
      case "teamNumber":
        setInputTeamNumberValue(value || "");
        break;
      case "oneLiner":
        setInputOneLinerValue(value || "");
        break;
      case "body":
        setInputBodyValue(value || "");
        break;
      default:
    }
    onEditorDataChange({
      ...editorData,
      [target]: value || "",
    });
  };

  const handlePopoverClose = (e) => {};

  const renderEditor = () => {
    return (
      <form className={classes.form} autoComplete="off">
        <div>
          <TextField
            className={classes.textFieldLastNameFirstName}
            label="Last Name"
            variant="outlined"
            value={inputLastNameValue}
            onChange={(e) => handleInputChange("lastName", e)}
            size="small"
            inputProps={{ style: { fontSize: "11pt" } }}
          ></TextField>
          <TextField
            className={classes.textFieldLastNameFirstName}
            label="First Name"
            variant="outlined"
            value={inputFirstNameValue}
            onChange={(e) => handleInputChange("firstName", e)}
            size="small"
            inputProps={{ style: { fontSize: "11pt" } }}
          ></TextField>
          <TextField
            className={classes.textFieldTeam}
            label="Team"
            variant="outlined"
            value={inputTeamNumberValue}
            onChange={(e) => handleInputChange("teamNumber", e)}
            size="small"
            inputProps={{ style: { fontSize: "11pt" } }}
          ></TextField>
        </div>
        <div>
          <TextField
            id="oneLiner"
            className={classes.textFieldOneLiner}
            label="One Liner"
            variant="outlined"
            value={inputOneLinerValue}
            onChange={(e) => handleInputChange("oneLiner", e)}
            multiline
            rows={2}
            inputProps={{ style: { fontSize: "11pt" } }}
          ></TextField>
          <TextField
            id="body"
            className={classes.textFieldBody}
            label="Content"
            variant="outlined"
            value={inputBodyValue}
            onChange={(e) => handleInputChange("body", e)}
            multiline
            rows={10}
            inputProps={{ style: { fontSize: "11pt" } }}
          ></TextField>
        </div>
        <Popover
          id={Boolean(anchorEl) ? "simple-popover" : undefined}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <div>
            <TextField>Search...</TextField>
          </div>
        </Popover>
      </form>
    );
  };

  return <div className={classes.editorRoot}>{renderEditor()}</div>;
};

export default BedspaceEditor;
