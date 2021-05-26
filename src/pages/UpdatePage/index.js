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
  switchPrimaryColor: {
    ".Mui-checked": {
      color: "#3ed5ee",
    },
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

/* This holds the functions we pass way down to the TableBedList's buttons */
export const BedActionsContext = createContext();

const UpdatePage = () => {
  const classes = useStyles();
  const media_atleast_lg = useMediaQuery("(min-width:1280px)");
  const media_atleast_md = useMediaQuery("(min-width:960px)");

  const { gridData, updateGridData } = useGridStateContext();
  const { authState, userIsLoggedIn } = useAuthStateContext();

  /* This "data" should match the gridData 
  TODO Should be able to just use gridData from the context without creating a local state variable */
  const [data, setData] = useState(null);
  const [bedspaceEditorData, setBedspaceEditorData] = useState(); // i.e. "Working" data
  const [selectedKey, setSelectedKey] = useState();
  const [needsSave, setNeedsSave] = useState(false);
  const [resetBedspaceEditor, setResetBedspaceEditor] = useState(false); // value not important, just using it to trigger re-render

  /* Hook for our Dialog modal */
  const { dialogIsOpen, dialog, showYesNoDialog } = useDialog();

  /* Track the toggle state of DemoBox collapsed status,
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
      // Show a warning dialog if there is data that isn't saved

      // Construct the message for the Dialog
      const content = (
        <div>
          <p>
            There are unsaved changes for this bedspace. Continue <i>without</i>{" "}
            saving?
          </p>
          <p>
            Bed: {data[selectedKey].bed}
            <br />
            {data[selectedKey].lastName
              ? `Patient: ${data[selectedKey].lastName}`
              : ""}
          </p>
        </div>
      );

      showYesNoDialog(
        content,
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

  const handleBedActionClear = (key) => {
    // Construct the message for the Dialog
    const content = (
      <div>
        <p>
          Are you sure you want to <b>CLEAR</b> the data in this bedspace?
          <br />
          <i>(The bedspace will remain.)</i>
        </p>
        <p>
          Bed: {data[key].bed}
          <br />
          {data[key].lastName ? `Patient: ${data[key].lastName}` : ""}
        </p>
      </div>
    );

    // Show the confirmation dialog before clearing
    showYesNoDialog(
      content,
      () => {
        //should delete callback
        let updatedData = [...data];
        updatedData[key] = { bed: updatedData[key].bed };
        console.log(`Cleared bedspace: ${updatedData[key].bed}`);
        updateGridData(updatedData); //send new data to GridStateContext (handles truth data)
        setBedspaceEditorData(updatedData[key]); // should clear the bedspaceEditor data
        setNeedsSave(false);
      },
      () => {
        //should cancel callback
        return false;
      }
    );
  };

  const handleBedActionDelete = (key) => {
    // Construct the delete message for the Dialog
    // Construct the message for the Dialog
    const content = (
      <div>
        <p>
          Are you sure you want to <b>REMOVE</b> this bedspace and it's data?
        </p>
        <p>
          Bed: {data[key].bed}
          <br />
          {data[key].lastName ? `Patient: ${data[key].lastName}` : ""}
        </p>
      </div>
    );

    // Show the confirmation dialog before deleting
    showYesNoDialog(
      content,
      () => {
        //should delete callback
        let updatedData = [...data];
        let deleted = updatedData.splice(key, 1);
        console.log(`Removed bedspace: ${JSON.stringify(deleted)}`);
        updateGridData(updatedData); //send new data to GridStateContext (handles truth data)
        setBedspaceEditorData(updatedData[key]); // should clear the bedspaceEditor data
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

  /* This handles the save action before trying to merge this new bedspace data with
  the overall GridDataContext. Specifically, we check to see if there has been a
  new bedspace (bed number) entered, i.e. we will warn the user that this may
  overwrite any data in that target bedspace */
  const handleOnSave = (e) => {
    e.preventDefault();

    const updatedData = [...data];

    // See if bedspaceEditorData has changed the bed number for this patient
    if (bedspaceEditorData.bed !== data[selectedKey].bed) {
      // create the warning message
      const content = (
        <div>
          <p>
            You are changing the bedspace for this patient? <b>WARNING: </b>This
            may overwrite any current data in this bedspace.
          </p>
          <p>
            Current Bed: {data[selectedKey].bed}
            <br />
            New Bed: {bedspaceEditorData.bed}
          </p>
        </div>
      );

      // Show the confirmation dialog before changing bedspace
      showYesNoDialog(
        content,
        () => {
          //should change bed
          // delete old bedspace data since we changed to a different bedspace
          updatedData.splice(selectedKey, 1);
          // commit the save action
          saveBedspaceEditorData(updatedData);
          // since the selectedKey is now different, just null it so incorrect data isn't displayed
          setSelectedKey(null);
        },
        () => {
          //should cancel callback
          return false;
        }
      );
    } else {
      // Not changing the bedspace, just other patient data

      // Commit the save action
      saveBedspaceEditorData(updatedData);
    }
  };

  /* The actual save action that merges this new bedspaceEditorData with
  the truth data in GridDataContext */
  const saveBedspaceEditorData = (dataToSave) => {
    /* For each object in data array, see if there is a bed number
    that matches that has been edited in bedspaceEditorData. */
    const objIndex = dataToSave.findIndex(
      (obj) => obj.bed === bedspaceEditorData.bed
    );
    /* If so, return the index of this object in the array */
    if (objIndex >= 0) {
      dataToSave[objIndex] = bedspaceEditorData;
    } else {
      // If bed doesn't exist, add new one
      dataToSave.push(bedspaceEditorData);
    }
    // send updated data to GridStateContext
    updateGridData(dataToSave);
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
                bedActionClear: handleBedActionClear,
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
                    color="primary"
                    classes={{
                      colorPrimary: classes.switchPrimaryColor,
                    }}
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
