import { useState, useEffect, createContext, useRef } from "react";
import {
  makeStyles,
  useMediaQuery,
  Grid,
  Button,
  Toolbar,
  Typography,
  Switch,
} from "@material-ui/core";

// Components
import TableBedList from "../../components/TableBedList";
import DemoBox from "../../components/DemoBox";
import BedspaceEditor from "../../components/BedspaceEditor";
import { useDialog } from "../../components/Dialog";

// Firebase
import { useAuthStateContext } from "../../context/AuthState";
import { useGridStateContext } from "../../context/GridState";

const useStyles = makeStyles({
  root: {
    padding: "0 1vw",
    justifyContent: "center",
  },
  bedspaceEditorToolbar: {
    borderBottom: "2px solid #f6f8fa",
  },
  bedspaceEditorToolbarBedNumber: {
    marginRight: 5,
    color: "#8c888821",
  },
  saveButton: {
    backgroundColor: "#b7d100",
    color: "#000000ab",
    "&:hover": {
      backgroundColor: "#b7d100a3",
      color: "black",
    },
    marginRight: "3px",
  },
  saveButtonDisabled: {
    backgroundColor: "#f4f4f466",
  },
  resetButton: {
    backgroundColor: "rgba(110, 214, 247, 0.30)",
    color: "#000000ab",
    "&:hover": {
      backgroundColor: "rgba(110, 214, 247, 0.5)",
      color: "black",
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
      "repeating-linear-gradient( -45deg, #e9ff4c2e, #f9ffcfc9 5px, #fff 5px, #f7ffbd1f 25px )",
  },
});

export const BedActionsContext = createContext();

const UpdatePage = () => {
  const classes = useStyles();
  const media_atleast_lg = useMediaQuery("(min-width:1280px)");
  const media_atleast_md = useMediaQuery("(min-width:960px)");

  const { gridData, updateGridData } = useGridStateContext();
  const { authState, userIsLoggedIn } = useAuthStateContext();

  const [data, setData] = useState(null); // i.e. "Truth" data
  const [bedspaceEditorData, setBedspaceEditorData] = useState(); // i.e. "Working" data
  const [selectedKey, setSelectedKey] = useState();
  const [needsSave, setNeedsSave] = useState(false);
  const [resetBedspaceEditor, setResetBedspaceEditor] = useState(false); // value not important, just using it to trigger re-render

  const { dialogIsOpen, dialog, showYesNoDialog } = useDialog();

  /* Track the toggle state of DemoBox collapsed variable,
  helpful for setting debounce interval in BedspaceEditor 
  i.e., if demobox is not visible, the debounce interval can be higher */
  const [demoBoxCollapsed, setDemoBoxCollapsed] = useState(true);

  /* Used as a target for the scrollToElement(), in order to put
 the BedspaceEditor into view after clicking the edit icon on smaller screens */
  const refToBedspaceEditorDiv = useRef(null);

  // Load data from GridStateContext
  useEffect(() => {
    setData(gridData);
  }, [gridData]);

  const handleBedActionEdit = (key) => {
    const doAction = () => {
      if (selectedKey === key) {
        // re-clicked on the same bedspace
        setSelectedKey(null);
      } else {
        // This is the key of the data array that corresponds to this selected bedspace
        setSelectedKey(key);
        /* When a new bed is selected, copy the truth data's (data) JSON object for this
    selected bedspace to the bedspaceEditorData */
        setBedspaceEditorData(data[key]);

        if (refToBedspaceEditorDiv && !media_atleast_md) {
          setTimeout(() => {
            refToBedspaceEditorDiv.current.scrollIntoView(false);
          }, 200);
        }
      }
    };

    if (needsSave) {
      // Show the warning dialog if there is data that isn't saved

      // Construct the message for the Dialog
      let arr = [
        "There are unsaved changes for this bedspace. Continue without saving?",
        `Bed: ${data[selectedKey].bed}`,
      ];
      arr.push(
        data[selectedKey].lastName
          ? `Patient: ${data[selectedKey].lastName}`
          : ""
      );
      const warningMessage = arr.join("\n");

      showYesNoDialog(
        warningMessage,
        () => {
          // chose to continue without saving
          doAction();
          setNeedsSave(false);
        },
        () => {
          // chose to cancel
          return;
        }
      );
    } else {
      doAction();
    }
  };

  const handleBedActionDelete = (key) => {
    // Construct the delete message for the Dialog
    let arr = [
      "Are you sure you want to REMOVE this bed? You will lose all bed data.",
      `Bed: ${data[key].bed}`,
    ];
    arr.push(data[key].lastName ? `Patient: ${data[key].lastName}` : "");
    const deleteMessage = arr.join("\n");

    // Show the confirmation dialog before deleting
    showYesNoDialog(
      deleteMessage,
      () => {
        //should delete callback
        let updatedData = [...data];
        let deleted = updatedData.splice(key, 1);
        console.log(`Removed bedspace: ${JSON.stringify(deleted)}`);
        updateGridData(updatedData); //send new data to GridStateContext (handles truth data)
        setBedspaceEditorData(updatedData[selectedKey]); // should clear the bedspaceEditor data
        setNeedsSave(false);
      },
      () => {
        //should cancel callback
        return false;
      }
    );
  };

  /* When a change in the BedspaceEditor's data occurs, it
  sends the new bedspace JSON object here.  */
  const handleOnEditorDataChange = (newBedspaceData) => {
    setBedspaceEditorData(newBedspaceData);
    setNeedsSave(true);
  };

  /* This handles data for a single bedspace (currently stored in bedspaceEditorData)
  that needs to be merged with the rest of the grid prior to sending
  a new data object to GridStateContext to update the truth gridData */
  const handleOnSave = (e) => {
    e.preventDefault();
    const updatedData = [...data];

    /* For each object in data array, see if there is a bed number
    matching the bed currently being stored in bedspaceEditordata.
    If so, return the index of this object in the array */
    const objIndex = updatedData.findIndex(
      (obj) => obj.bed === bedspaceEditorData.bed
    );

    if (objIndex >= 0) {
      updatedData[objIndex] = bedspaceEditorData;
    } else {
      // If bed doesn't exist, add new one
      updatedData.push(bedspaceEditorData);
    }

    // send updated data to GridStateContext
    updateGridData(updatedData);
    setNeedsSave(false);
  };

  /* Want to reset the data being used in the bedspaceEditor
  to the saved "truth" data, i.e. reset changes back to the 
  last saved state */
  const handleOnReset = (e) => {
    e.preventDefault();
    setBedspaceEditorData(data[selectedKey]);
    setResetBedspaceEditor((prevValue) => !prevValue); // triggers re-render of BedspaceEditor
    setNeedsSave(false);
  };

  /* - - - - - RETURN - - - - - */
  if (data != null) {
    return (
      <div>
        <Grid container className={classes.root}>
          <Grid
            item
            md={4}
            sm={7}
            xs={12}
            style={{ padding: "0 6px", marginBottom: "8px" }}
          >
            <BedActionsContext.Provider
              value={{
                bedActionEdit: handleBedActionEdit,
                bedActionDelete: handleBedActionDelete,
              }}
            >
              <TableBedList data={data} selectedKey={selectedKey} />
            </BedActionsContext.Provider>
          </Grid>
          <Grid item lg md={8} sm={12} xs={12} ref={refToBedspaceEditorDiv}>
            {selectedKey != null && (
              <Grid container>
                <Grid item xs={12}>
                  <Switch
                    checked={!demoBoxCollapsed}
                    onChange={() =>
                      setDemoBoxCollapsed((prevValue) => !prevValue)
                    }
                  />
                  <DemoBox
                    data={bedspaceEditorData}
                    collapsed={demoBoxCollapsed}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Toolbar
                    variant="dense"
                    className={classes.bedspaceEditorToolbar}
                  >
                    <Typography
                      variant="h1"
                      className={classes.bedspaceEditorToolbarBedNumber}
                    >
                      {data[selectedKey].bed}
                    </Typography>
                    <Button
                      classes={{
                        root: classes.saveButton,
                        disabled: classes.saveButtonDisabled,
                      }}
                      size="small"
                      disabled={!needsSave}
                      onClick={(e) => handleOnSave(e)}
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
                    defaultValues={data[selectedKey]}
                    onEditorDataChange={handleOnEditorDataChange}
                    reset={resetBedspaceEditor}
                    debounceInterval={demoBoxCollapsed ? 500 : 300}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        {dialogIsOpen && dialog}
      </div>
    );
  } else {
    return <>Loading...</>;
  }
};

export default UpdatePage;
