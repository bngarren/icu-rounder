import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// MUI
import { useMediaQuery, Grid, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";

// Components
import TableGridDataElements from "./TableGridDataElements";
import DemoAndEditorController from "./DemoAndEditorController";
import { useDialog } from "../../components";

// Context
import { DebouncedContextProvider } from "./DebouncedContext";
import GridDataElementActionsContext from "./GridDataElementActionsContext";

// Utils/helpers
import {
  DEFAULT_GRID_DATA_ELEMENT_DATA,
  getKeyForGridDataElementID,
} from "../../utils";
import {
  doesLocationExistInGridData,
  getAdjacentGridDataElement,
} from "./updateHelpers";
import { v4 as uuidv4 } from "uuid";

// Firebase
import { useGridStateContext } from "../../context/GridState";

const UpdatePage = () => {
  const theme = useTheme();

  // Media queries for CSS
  const media_atleast_md = useMediaQuery("(min-width:960px)");

  // The truth GridState and gridData
  const { gridData, census, updateGridData } = useGridStateContext();

  /* Index of the gridDataElement selected and currently being "edited" */
  const [selectedKey, setSelectedKey] = useState();

  /* true, if an unsaved changed has occurred in GridDataElementEditor */
  const [needsSave, setNeedsSave] = useState(false);

  /* An initial or "default" set of data for a gridDataElement */
  const [defaultGridDataElementData, setDefaultGridDataElementData] =
    useState();

  /* UpdatePage keeps this default gridDataElement data in its state in order to pass
  to DemoAndEditorController when a gridDataElement is selected. It combines any of
  the selected GDE's data with default data so that DemoAndEditorController
  has at least some appropriate value for every property of GDE */
  useEffect(() => {
    const selectedData = {
      ...(gridData?.length !== 0 &&
        selectedKey != null &&
        gridData[selectedKey]),
    };
    setDefaultGridDataElementData({
      ...DEFAULT_GRID_DATA_ELEMENT_DATA,
      ...selectedData,
    });
  }, [selectedKey, gridData]);

  /* Hook for our Dialog modal */
  const { dialogIsOpen, dialog, showYesNoDialog } = useDialog();

  /* Used as a target for the scrollToElement(), in order to put
 the GridDataElementEditor into view after clicking the edit icon on smaller screens */
  const refToGridDataElementEditorDiv = useRef(null);

  const setCurrentGridDataElement = (key) => {
    // This is the key of the grid data array that corresponds to this selected gridDataElement
    setSelectedKey(key);
  };

  /* 
  - - - NAVIGATION - - -
  
  Handles the < and > buttons for selecting the previous or next gridDataElement.
  Calls setCurrentGridDataElement which updates the selectedKey and GridDataElementEditor's data */
  /**
   *
   * @param {boolean} reverse If true, move backwards a gridDataElement. If false, move forwards.
   */
  const navigateAdjacentGridDataElement = (reverse) => {
    setCurrentGridDataElement(
      getAdjacentGridDataElement(gridData, selectedKey, reverse)
    );
  };

  const handleGridDataElementActionEdit = useCallback(
    (key) => {
      const doAction = () => {
        if (selectedKey === key) {
          // re-clicked on the same gridDataElement
          setSelectedKey(null);
        } else {
          setCurrentGridDataElement(key);

          if (refToGridDataElementEditorDiv && !media_atleast_md) {
            setTimeout(() => {
              refToGridDataElementEditorDiv?.current?.scrollIntoView(false);
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
              changes for this person. Continue <i>without</i> saving?
            </div>
            <div>
              Location: {gridData[selectedKey].location}
              <br />
              {gridData[selectedKey].lastName
                ? `Name: ${gridData[selectedKey].lastName}`
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
   * @param {number} key Index of the gridDataElement to clear the data
   */
  const handleGridDataElementActionClear = useCallback(
    (key) => {
      // Construct the message for the Dialog
      const content = (
        <>
          <div>
            Are you sure you want to{" "}
            <b>
              <span style={{ color: theme.palette.warning.main }}>CLEAR</span>
            </b>{" "}
            the data for this person?
            <br />
            <i>(The location will remain in your grid.)</i>
          </div>
          <div>
            Location: {gridData[key].location}
            <br />
            {gridData[key].lastName ? `Name: ${gridData[key].lastName}` : ""}
          </div>
        </>
      );

      // Show the confirmation dialog before clearing
      showYesNoDialog(
        content,
        () => {
          //should clear callback
          let updatedData = [...gridData];
          // only keep the id and location
          updatedData[key] = {
            id: updatedData[key].id,
            location: updatedData[key].location,
          };
          updateGridData(updatedData); //send new data to GridState context (handles truth data)
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

  const handleGridDataElementActionDelete = useCallback(
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
            this location and it&#39;s data?
          </div>
          <div>
            Location: {gridData[key].location}
            <br />
            {gridData[key].lastName ? `Name: ${gridData[key].lastName}` : ""}
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
  - Before trying to merge this modified gridDataElement data with the gridData (in GridStateContext),
  we can run some checks, E.g., see if there has been a new location entered--because 
  we will warn the user that this may overwrite any data in that target location
  */
  const handleOnSave = useCallback(
    (gridDataElementEditorData) => {
      const updatedData = [...gridData]; // copy the current gridData

      /* The actual save action that merges this modified gridDataElementEditorData
      with the truth data in GridDataContext */
      const saveGridDataElementEditorData = (gridDataToSave) => {
        // See if this location already exists in gridData
        const { objIndex, locationAlreadyExists } = doesLocationExistInGridData(
          gridDataElementEditorData,
          gridDataToSave
        );
        /* If location already exists, overwrite with new data */
        if (locationAlreadyExists) {
          gridDataToSave[objIndex] = gridDataElementEditorData;
        } else {
          // If location doesn't exist, add new one
          gridDataToSave.push(gridDataElementEditorData);
        }
        // send updated data to GridStateContext
        updateGridData(gridDataToSave).then((res) => {
          if (res) {
            const newKey = getKeyForGridDataElementID(
              res,
              gridDataElementEditorData.id
            );
            setSelectedKey(newKey);
          } else {
            setSelectedKey(null);
          }
        });
        setNeedsSave(false);
      };

      //! See if gridDataElementEditor's data has changed the location for this gridDataElement
      if (
        gridDataElementEditorData.location !== gridData[selectedKey].location
      ) {
        // create the warning message
        const content = (
          <>
            <div>
              You are changing the location for this person.{" "}
              <b>
                <span
                  style={{
                    color: theme.palette.warning.main,
                  }}
                >
                  WARNING:{" "}
                </span>
              </b>
              This will overwrite any data already present in the new location.
            </div>
            <div>
              Current Location: {gridData[selectedKey].location}
              <br />
              New Location: {gridDataElementEditorData.location}
            </div>
          </>
        );

        // Show the confirmation dialog before changing location
        showYesNoDialog(
          content,
          () => {
            //should change location

            //* clear the gridDataElement's data at the previous location, but keep the location present (don't delete)
            updatedData[selectedKey] = {
              id: uuidv4(), // new id for the old gridDataElement
              location: updatedData[selectedKey].location,
            };

            //* Commit the save action
            saveGridDataElementEditorData(updatedData);
          },
          () => {
            //should cancel callback
            return false;
          }
        );
      } else {
        // Not changing the location, just other gridDataElement data

        //* Commit the save action
        saveGridDataElementEditorData(updatedData);
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

  const gridDataElementActions = useMemo(
    () => ({
      gridDataElementActionEdit: handleGridDataElementActionEdit,
      gridDataElementActionClear: handleGridDataElementActionClear,
      gridDataElementActionDelete: handleGridDataElementActionDelete,
    }),
    [
      handleGridDataElementActionClear,
      handleGridDataElementActionDelete,
      handleGridDataElementActionEdit,
    ]
  );

  /* - - - - - RETURN - - - - - */

  if (gridData != null) {
    return (
      <div>
        <Grid container>
          <Grid item lg={4} md={5} sm={10} xs={12} sx={{ py: 0, px: 1, mb: 1 }}>
            <GridDataElementActionsContext.Provider
              value={gridDataElementActions}
            >
              <TableGridDataElements
                data={gridData}
                selectedKey={selectedKey}
              />
            </GridDataElementActionsContext.Provider>
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
                  {census.emptyElements.length > 0 &&
                    `[${census.emptyElements.toString()}]`}
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
          <Grid item lg md sm={0} xs ref={refToGridDataElementEditorDiv}>
            {selectedKey != null && (
              <DebouncedContextProvider>
                <DemoAndEditorController
                  defaultGridDataElementData={defaultGridDataElementData}
                  needsSave={needsSave}
                  setNeedsSave={setNeedsSave}
                  onChangeGridDataElement={navigateAdjacentGridDataElement}
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
export default UpdatePage;
