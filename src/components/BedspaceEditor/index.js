import { useEffect, useState } from "react";

import {
   makeStyles,
   Grid,
   TextField,
   Button,
   Popover,
} from "@material-ui/core";

const useStyles = makeStyles({
   editorRoot: {
      padding: "10px",
   },
   form: {

   },
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
});

const BedspaceEditor = ({ data, onEditorDataChange = (f) => f }) => {
   const classes = useStyles();
   const [editorData, setEditorData] = useState({});

   const [inputLastNameValue, setInputLastNameValue] = useState("");
   const [inputFirstNameValue, setInputFirstNameValue] = useState("");
   const [inputTeamValue, setInputTeamValue] = useState("");
   const [inputOneLinerValue, setInputOneLinerValue] = useState("");

   const [anchorEl, setAnchorEl] = useState(null);

   /* Anytime a new bedspace is selected by the user or
   new bedspace data comes through as prop, update this component's
   state */
   useEffect(() => {
      // Update our editor's bedspace data (JSON object)
      setEditorData(data);
   }, [data]);

   useEffect(() => {
      // Update our controlled form fields
      setInputLastNameValue(editorData.lastName || "");
      setInputFirstNameValue(editorData.firstName || "");
      setInputTeamValue(editorData.teamNumber || "");
      setInputOneLinerValue(editorData.oneLiner || "");
   }, [editorData]);

   const handleInputLastNameChange = (value) => {
      const newLastName = value.trim();
      onEditorDataChange({
         ...editorData,
         lastName: newLastName || "",
      });
   };

   const handleInputFirstNameChange = (value) => {
      const newFirstName = value.trim();
      onEditorDataChange({
         ...editorData,
         firstName: newFirstName || "",
      });
   };

   const handleInputTeamChange = (value) => {
      const newTeam = value.trim();
      onEditorDataChange({
         ...editorData,
         teamNumber: newTeam || "",
      });
   };

   const handleInputOneLinerChange = (e) => {
      const value = e.target.value;
      const newOneLiner = value;
      onEditorDataChange({
         ...editorData,
         oneLiner: newOneLiner || "",
      });

      if (value.slice(-1) === "$") {
         setAnchorEl(e.currentTarget);
      }
   };

   const handlePopoverClose = (e) => {
      setAnchorEl(null);
      let newOneLiner = inputOneLinerValue;
      if (inputOneLinerValue.slice(-1) === "$") {
         newOneLiner = inputOneLinerValue.slice(0, -1);
      }
      onEditorDataChange({
         ...editorData,
         oneLiner: newOneLiner,
      });
   }

   const renderEditor = () => {
      return (
         <form className={classes.form} autoComplete="off">
            <div>
               <TextField
                  className={classes.textFieldLastNameFirstName}
                  label="Last Name"
                  variant="outlined"
                  value={inputLastNameValue}
                  onChange={(e) => handleInputLastNameChange(e.target.value)}
                  size="small"
                  inputProps={{ style: { fontSize: "11pt" } }}
               ></TextField>
               <TextField
                  className={classes.textFieldLastNameFirstName}
                  label="First Name"
                  variant="outlined"
                  value={inputFirstNameValue}
                  onChange={(e) => handleInputFirstNameChange(e.target.value)}
                  size="small"
                  inputProps={{ style: { fontSize: "11pt" } }}
               ></TextField>
               <TextField
                  className={classes.textFieldTeam}
                  label="Team"
                  variant="outlined"
                  value={inputTeamValue}
                  onChange={(e) => handleInputTeamChange(e.target.value)}
                  size="small"
                  inputProps={{ style: { fontSize: "11pt" } }}
               ></TextField>
            </div>
            <div>
               <TextField
                  className={classes.textFieldOneLiner}
                  label="One Liner"
                  variant="outlined"
                  value={inputOneLinerValue}
                  onChange={(e) => handleInputOneLinerChange(e)}
                  multiline
                  rows={2}
                  inputProps={{ style: { fontSize: "11pt" } }}
               ></TextField>
            </div>
            <Popover
               id={Boolean(anchorEl) ? 'simple-popover' : undefined}
               open={Boolean(anchorEl)}
               anchorEl={anchorEl}
               onClose={handlePopoverClose}
               anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
               }}
               transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
               }}
            >
               <div>
                  <TextField>
                     Search...
                  </TextField>
               </div>
            </Popover>
         </form>
      )
   }

   return (

      <div className={classes.editorRoot}>{renderEditor()}</div>

   );
};

export default BedspaceEditor;