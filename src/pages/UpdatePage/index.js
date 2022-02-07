import {
  useState,
  useEffect,
  createContext,
  useRef,
  useCallback,
  useMemo,
} from "react";

// MUI
import { useMediaQuery, Grid, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";

// Components
import TableBedList from "../../components/TableBedList";
import DemoAndEditorController from "../../components/DemoAndEditorController";
import { useDialog } from "../../components/Dialog";

// context
import { DebouncedContextProvider } from "./DebouncedContext";

// Firebase
import { useGridStateContext } from "../../context/GridState";

/* This holds the functions we pass way down to the TableBedList's buttons */
export const BedActionsContext = createContext();

const UpdatePage = () => {
  const theme = useTheme();

  // Media queries for CSS
  const media_atleast_md = useMediaQuery("(min-width:960px)");

  // The truth GridState and gridData
  const { gridData, census, updateGridData } = useGridStateContext();

  const [selectedKey, setSelectedKey] = useState(); // index of the bedspace being "edited"
  const [needsSave, setNeedsSave] = useState(false); // true, if an unsaved changed has occurred in bedspaceEditor

  const [defaultBedData, setDefaultBedData] = useState();

  /* Default bed data */
  const defaults = useRef({
    bed: "",
    lastName: "",
    firstName: "",
    teamNumber: "",
    oneLiner: "",
    contingencies: [],
    contentType: "simple",
    simpleContent: "",
    nestedContent: [],
    bottomText: "",
  });

  useEffect(() => {
    setDefaultBedData({
      ...defaults.current,
      ...gridData[selectedKey],
    });
  }, [selectedKey, gridData]);

  /* Hook for our Dialog modal */
  const { dialogIsOpen, dialog, showYesNoDialog } = useDialog();

  /* Used as a target for the scrollToElement(), in order to put
 the BedspaceEditor into view after clicking the edit icon on smaller screens */
  const refToBedspaceEditorDiv = useRef(null);

  const setCurrentBed = (key) => {
    // This is the key of the data array that corresponds to this selected bedspace
    setSelectedKey(key);
  };

  /* 
  - - - NAVIGATION - - -
  
  Handles the < and > buttons for selecting the previous or next bedspace.
  Calls setCurrentBed which updates the selectedKey and BedspaceEditorData */
  /**
   *
   * @param {boolean} reverse If true, move backwards a bedspace. If false, move forwards.
   */
  const navigateNextBedspace = (reverse) => {
    setCurrentBed(getNextBedspace(gridData, selectedKey, reverse));
  };

  const handleBedActionEdit = useCallback(
    (key) => {
      const doAction = () => {
        if (selectedKey === key) {
          // re-clicked on the same bedspace
          setSelectedKey(null);
        } else {
          setCurrentBed(key);

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
          <>
            <div>
              There are{" "}
              <span style={{ color: theme.palette.warning.main }}>
                unsaved{" "}
              </span>
              changes for this bedspace. Continue <i>without</i> saving?
            </div>
            <div>
              Bed: {gridData[selectedKey].bed}
              <br />
              {gridData[selectedKey].lastName
                ? `Patient: ${gridData[selectedKey].lastName}`
                : ""}
            </div>
          </>
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
    },
    [
      gridData,
      media_atleast_md,
      needsSave,
      selectedKey,
      showYesNoDialog,
      theme.palette.warning.main,
    ]
  );

  /**
   *
   * @param {number} key Index of the bedspace to clear the data
   */
  const handleBedActionClear = useCallback(
    (key) => {
      // Construct the message for the Dialog
      const content = (
        <>
          <div>
            Are you sure you want to{" "}
            <b>
              <span style={{ color: theme.palette.warning.main }}>CLEAR</span>
            </b>{" "}
            the data in this bedspace?
            <br />
            <i>(The bedspace will remain.)</i>
          </div>
          <div>
            Bed: {gridData[key].bed}
            <br />
            {gridData[key].lastName ? `Patient: ${gridData[key].lastName}` : ""}
          </div>
        </>
      );

      // Show the confirmation dialog before clearing
      showYesNoDialog(
        content,
        () => {
          //should clear callback
          let updatedData = [...gridData];
          updatedData[key] = { bed: updatedData[key].bed }; // only keep the bed
          updateGridData(updatedData); //send new data to GridStateContext (handles truth data)
          setNeedsSave(false);
        },
        () => {
          //should cancel callback
          return false;
        }
      );
    },
    [gridData, showYesNoDialog, theme.palette.warning.main, updateGridData]
  );

  const handleBedActionDelete = useCallback(
    (key) => {
      // Construct the delete message for the Dialog
      // Construct the message for the Dialog
      const content = (
        <>
          <div>
            Are you sure you want to{" "}
            <b>
              <span style={{ color: theme.palette.warning.main }}>REMOVE</span>
            </b>{" "}
            this bedspace and it&#39;s data?
          </div>
          <div>
            Bed: {gridData[key].bed}
            <br />
            {gridData[key].lastName ? `Patient: ${gridData[key].lastName}` : ""}
          </div>
        </>
      );

      // Show the confirmation dialog before deleting
      showYesNoDialog(
        content,
        () => {
          //should delete callback
          let updatedData = [...gridData];
          updatedData.splice(key, 1); // will return the deleted items, but we don't use them for now
          updateGridData(updatedData); //send new data to GridStateContext (handles truth data)
          setNeedsSave(false);
          setSelectedKey(null);
        },
        () => {
          //should cancel callback
          return false;
        }
      );
    },
    [gridData, showYesNoDialog, theme.palette.warning.main, updateGridData]
  );

  /* Handles the SAVE action.
  - Before trying to merge this new bedspace data with the gridData (in GridStateContext),
  we can run some checks, E.g., see if there has been a new bed number entered--because 
  we will warn the user that this may overwrite any data in that target bedspace
  */
  const handleOnSave = useCallback(
    (bedspaceEditorData) => {
      const updatedData = [...gridData]; // copy the current gridData

      /*
         //* The actual save action
         that merges this new bedspaceEditorData with the truth data in GridDataContext */
      const saveBedspaceEditorData = (dataToSave) => {
        /* Find out if there is already a bed number in our grid
            that matches the bed that has just been edited (bedspaceEditorData). */
        const objIndex = dataToSave.findIndex((obj) => {
          const bed = obj.bed + ""; // cast bed to string before comparison
          return bed === bedspaceEditorData.bed + "";
        });
        /* If bed already exists, overwrite with new data */
        if (objIndex >= 0) {
          dataToSave[objIndex] = bedspaceEditorData;
        } else {
          // If bed doesn't exist, add new one
          dataToSave.push(bedspaceEditorData);
        }
        // send updated data to GridStateContext
        updateGridData(dataToSave).then((res) => {
          if (res) {
            const newKey = getKeyForBed(res, bedspaceEditorData.bed);
            setSelectedKey(newKey);
          } else {
            setSelectedKey(null);
          }
        });
        setNeedsSave(false);
      };

      //! See if bedspaceEditorData has changed the bed number for this patient
      if (bedspaceEditorData.bed !== gridData[selectedKey].bed) {
        // create the warning message
        const content = (
          <>
            <div>
              You are changing the bedspace for this patient.{" "}
              <b>
                <span
                  style={{
                    color: theme.palette.warning.main,
                  }}
                >
                  WARNING:{" "}
                </span>
              </b>
              This will overwrite any data already present in the new bedspace.
            </div>
            <div>
              Current Bed: {gridData[selectedKey].bed}
              <br />
              New Bed: {bedspaceEditorData.bed}
            </div>
          </>
        );

        // Show the confirmation dialog before changing bedspace
        showYesNoDialog(
          content,
          () => {
            //should change bed

            //* clear the previous bed, but keep it (don't delete)
            updatedData[selectedKey] = {
              bed: updatedData[selectedKey].bed, // only keep the bed
            };

            //* Commit the save action
            saveBedspaceEditorData(updatedData);
          },
          () => {
            //should cancel callback
            return false;
          }
        );
      } else {
        // Not changing the bedspace, just other patient data

        //* Commit the save action
        saveBedspaceEditorData(updatedData);
      }
    },
    [
      gridData,
      selectedKey,
      showYesNoDialog,
      theme.palette.warning.main,
      updateGridData,
    ]
  );

  const bedActions = useMemo(
    () => ({
      bedActionEdit: handleBedActionEdit,
      bedActionClear: handleBedActionClear,
      bedActionDelete: handleBedActionDelete,
    }),
    [handleBedActionClear, handleBedActionDelete, handleBedActionEdit]
  );

  /* - - - - - RETURN - - - - - */

  if (gridData != null) {
    return (
      <div>
        <Grid container>
          <Grid item lg={4} md={5} sm={10} xs={12} sx={{ py: 0, px: 1, mb: 1 }}>
            <BedActionsContext.Provider value={bedActions}>
              <TableBedList data={gridData} selectedKey={selectedKey} />
            </BedActionsContext.Provider>
            {census ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  p: 0.5,
                  pt: 1,
                }}
              >
                <Typography variant="caption">
                  {`${census.filledTotal}/${census.total}`}{" "}
                  {census.emptyBeds.length > 0 &&
                    `[${census.emptyBeds.toString()}]`}
                </Typography>
                {census.teamTotals.map((t) => {
                  return (
                    <Typography variant="caption" key={t.id}>
                      <b>{t.id}</b>
                      {`: ${t.value}`}
                    </Typography>
                  );
                })}
              </Box>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item lg md sm={0} xs ref={refToBedspaceEditorDiv}>
            {selectedKey != null && (
              <DebouncedContextProvider>
                <DemoAndEditorController
                  defaultBedData={defaultBedData}
                  needsSave={needsSave}
                  setNeedsSave={setNeedsSave}
                  onNextBedspace={navigateNextBedspace}
                  onSave={handleOnSave}
                />
              </DebouncedContextProvider>
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

/* Helper function that returns the key in the gridData array corresponding
to the bed number provided */
const getKeyForBed = (gridData, bed) => {
  for (const [index, element] of gridData.entries()) {
    if (element.bed === bed) return index;
  }
  return null;
};

/* Helper function for finding next or previous index in given array, or 
cycles to the end. */
/**
 *
 * @param {array} arr Array of bedspace data, e.g. each index is a bedspace
 * @param {number} currentIndex Starting index, i.e. current bedspace in the editor
 * @param {boolean} reverse  If true, will go back a bedspace. If false, will go forward
 * @returns {number} The new index
 */
const getNextBedspace = (arr, currentIndex, reverse = false) => {
  const newIndex = reverse ? currentIndex - 1 : currentIndex + 1;
  if (newIndex < 0) {
    return arr.length - 1;
  }
  if (newIndex > arr.length - 1) {
    return 0;
  }
  return newIndex;
};

export default UpdatePage;
