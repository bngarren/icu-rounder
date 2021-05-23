import { useState, useEffect, useCallback, useRef } from "react";
import {
  makeStyles,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Tooltip,
  Grid,
  Button,
  Toolbar,
  IconButton,
  Typography,
  Switch,
} from "@material-ui/core";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

// Components
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
  tableContainer: {},
  table: {},
  tableRow: {
    "&.Mui-selected": {
      backgroundColor: "#b7d10033",
    },
    "&.Mui-selected:hover": {
      backgroundColor: "#b7d10059",
    },
  },
  tableHeader: {
    backgroundColor: "#f6f8fa",
    color: "black",
    padding: "4px 2px 4px 10px",
  },
  tableHeaderBedNumber: {
    color: "#626060",
    fontWeight: "bold",
  },
  tableEditButton: {
    cursor: "pointer",
    color: "#626060",
    fontSize: "22px",
  },
  tableEditButtonSelected: {
    color: "#b7d100",
  },
  tableDeleteButton: {
    cursor: "pointer",
    fontSize: "22px",
    color: "#626060",
  },
  transparent: {
    color: "transparent",
  },
  tableCellDefault: {
    padding: "3px 10px 3px 15px",
    fontSize: "12pt",
  },
  tableCellSmall: {
    padding: "2px 2px 2px 10px",
    fontSize: "11pt",
  },
  tablePaginationRoot: {
    overflow: "hidden",
    padding: 0,
  },
  tablePaginationToolbar: {
    paddingLeft: "5px",
  },
  tablePaginationInput: {
    marginRight: "15px",
  },
  tablePaginationCaption: {
    fontSize: "9pt",
  },
  tablePaginationButton: {
    padding: "6px",
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

const ROWS_PER_PAGE = 15;

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
  helpful for setting debounce interval in BedspaceEditor */
  const [demoBoxCollapsed, setDemoBoxCollapsed] = useState(true);

  // table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);

  /* Used as a target for the scrollToElement(), in order to put
 the BedspaceEditor into view after clicking the edit icon on smaller screens */
  const refToBedspaceEditorDiv = useRef(null);

  // Load data from GridStateContext
  useEffect(() => {
    setData(gridData);
  }, [gridData]);

  // Load data (either from localStorage or sampleData file)

  /* This is ONLY for development. In production, the persistence of the data would need a better method */
  /*   useEffect(() => {
    const getData = async () => {
      // Try local storage first
      const resultJsonFromLocal = localStorage.getItem("gridData");
      if (resultJsonFromLocal != null) {
        console.log(`Saved data available in localStorage.`);
        const jsonFromLocal = JSON.parse(resultJsonFromLocal);
        let arr = [];
        for (let i in jsonFromLocal) {
          arr.push(jsonFromLocal[i]);
        }
        const arraySortedByBed = sortByBed(arr);
        setData(mergeWithBedCensus(arraySortedByBed, BED_CENSUS));
      } else {
        console.log(
          `NO data available in localStorage. Pulling data from sample file.`
        );
        const jsonFromSampleFile = await JSON.parse(JSON.stringify(sampleData));
        let arr = [];
        for (let i in jsonFromSampleFile) {
          arr.push(jsonFromSampleFile[i]);
        }
        const arraySortedByBed = sortByBed(arr);
        setData(mergeWithBedCensus(arraySortedByBed, BED_CENSUS));
      }
    };
    getData();
  }, []); */

  // Each time data changes, save it to localStorage

  /* We save the data to the 'gridData' variable in the browser's localStorage.
     Remember, since we pull the JSON data in and then immediately store it in our
     program as an Array (for sorting), BEFORE saving we have to convert to back to the regular
     JSON object of objects
  */
  /*   useEffect(() => {
    if (data != null) {
      const dataToSave = JSON.stringify(getJsonObjectFromSortedArray(data));
      localStorage.setItem("gridData", dataToSave);
      //console.log(`Saved data to localStorage: ${dataToSave}`);
    }
  }, [data]); */

  const handleEditIconClick = (key) => {
    if (selectedKey === key) {
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

  const handleDeleteIconClick = (key) => {
    // Construct the delete message for the Dialog
    let arr = [
      "Are you sure you want to empty this bed?",
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

  // table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // table pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  /* Helpful for determining if delete icon should be shown or not */
  const isBedEmpty = useCallback((bedData) => {
    let result = true;
    for (const [key, value] of Object.entries(bedData)) {
      if (key !== "bed" && value) {
        // if any value but bed is non-empty
        result = false;
      }
    }
    return result;
  }, []);

  const tableCellClasses = [
    classes.tableCellDefault,
    !media_atleast_lg && classes.tableCellSmall,
  ].join(" ");

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
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableHeader}
                      style={{ minWidth: 30 }}
                    >
                      Bed
                    </TableCell>
                    <TableCell
                      className={classes.tableHeader}
                      style={{ width: "100%" }}
                    >
                      Patient
                    </TableCell>
                    <TableCell
                      className={classes.tableHeader}
                      style={{ minWidth: 30, maxWidth: 30 }}
                    >
                      Team
                    </TableCell>
                    <TableCell
                      className={classes.tableHeader}
                      style={{ minWidth: "30px", maxWidth: "30px" }}
                    />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((value, key) => {
                      let adjustedKey = key + page * rowsPerPage; // the key resets to index 0 for every pagination page
                      let isSelected = adjustedKey === selectedKey;
                      const emptyBed = isBedEmpty(value);
                      return (
                        <TableRow
                          className={classes.tableRow}
                          key={value.bed}
                          hover
                          selected={isSelected}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            className={tableCellClasses}
                          >
                            <Typography
                              variant="h5"
                              className={classes.tableHeaderBedNumber}
                            >
                              {value.bed}
                            </Typography>
                          </TableCell>
                          <TableCell align="left" className={tableCellClasses}>
                            <span>
                              {value["lastName"]}
                              {value["lastName"] && value["firstName"] && ", "}
                              {value["firstName"]}
                            </span>
                          </TableCell>
                          <TableCell
                            align="center"
                            className={tableCellClasses}
                          >
                            <span>{value["teamNumber"]}</span>
                          </TableCell>
                          <TableCell className={tableCellClasses}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                              }}
                            >
                              {
                                <Tooltip title="Edit">
                                  <IconButton
                                    onClick={() =>
                                      handleEditIconClick(adjustedKey)
                                    }
                                  >
                                    <EditIcon
                                      fontSize="small"
                                      className={[
                                        classes.tableEditButton,
                                        isSelected &&
                                          classes.tableEditButtonSelected,
                                      ].join(" ")}
                                    />
                                  </IconButton>
                                </Tooltip>
                              }
                              {
                                <Tooltip title={!emptyBed ? "Clear" : ""}>
                                  <IconButton
                                    onClick={() =>
                                      handleDeleteIconClick(adjustedKey)
                                    }
                                    disabled={emptyBed}
                                  >
                                    <DeleteIcon
                                      fontSize="small"
                                      className={
                                        emptyBed
                                          ? classes.transparent
                                          : classes.tableDeleteButton
                                      }
                                    />
                                  </IconButton>
                                </Tooltip>
                              }
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                classes={{
                  root: classes.tablePaginationRoot,
                  toolbar: classes.tablePaginationToolbar,
                  input: classes.tablePaginationInput,
                  caption: classes.tablePaginationCaption,
                }}
                backIconButtonProps={{
                  classes: {
                    root: classes.tablePaginationButton,
                  },
                }}
                nextIconButtonProps={{
                  classes: {
                    root: classes.tablePaginationButton,
                  },
                }}
                rowsPerPageOptions={[5, 15, 30]}
                colSpan={5}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableContainer>
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
                    debounceInterval={demoBoxCollapsed ? 700 : 300}
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
