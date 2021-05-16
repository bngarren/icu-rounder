import { useState, useEffect } from "react";
import {
  makeStyles,
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
  Avatar,
  Typography,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import BedspaceEditor from "../../components/BedspaceEditor";

import sampleData from "../../data/data.json";

import { sortByBed } from "../../utils/Utility";

const useStyles = makeStyles({
  root: {
    padding: "0 1vw",
  },
  tableContainer: {
    margin: "10 10",
  },
  table: {
    minWidth: "400px",
  },
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
  },
  tableHeaderBedspaceGrid: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  bedNumberAvatar: {
    width: "26px",
    height: "26px",
    fontSize: "14px",
    backgroundColor: "black",
  },
  demoBox: {
    backgroundColor: "white",
    width: "185pt",
    height: "250pt",
    margin: "auto",
    border: "1px solid #1e1e1e",
    fontSize: "9pt",
  },
  demoBoxHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderBottom: "1pt solid black",
  },
  demoBoxHeaderBed: {
    marginRight: "4px",
    paddingLeft: "0.5em",
    paddingRight: "0.5em",
    borderRight: "1px solid black",
    fontWeight: "bold",
  },
  demoBoxHeaderName: {
    flexGrow: "4",
  },
  demoBoxHeaderTeam: {
    marginLeft: "4px",
    paddingLeft: "0.5em",
    paddingRight: "0.5em",
    borderLeft: "1px solid black",
  },
  demoBoxBody: {
    fontSize: "8pt",
    padding: "3px",
    whiteSpace: "pre-line",
  },
  demoBoxBodyOneLiner: {
    marginBottom: "2px",
  },
  demoBoxBodyContingencies: {
    display: "flex",
    flexDirection: "row",
    fontSize: "7pt",
    fontWeight: "bold",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignContent: "center",
    marginBottom: "2px",
  },
  demoBoxBodyContingencyItem: {
    border: "1pt solid #dbdbdb",
    borderRadius: "2pt",
    padding: "0 1px 1px 2px",
    marginTop: "1pt",
    marginRight: "2pt",
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
});

const BED_CENSUS = 30;

const UpdatePage = () => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [bedspaceEditorData, setBedspaceEditorData] = useState();
  const [selectedKey, setSelectedKey] = useState();
  const [needsSave, setNeedsSave] = useState(false);
  const [resetBedspaceEditor, setResetBedspaceEditor] = useState(false); // value not important, just using it to trigger re-render
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getJsonObjectFromSortedArray = (arr) => {
    // converts the array back to a JSON "object of objects"
    const result = {};
    arr.forEach((b) => {
      result[b.bed] = b;
    });
    return result;
  };

  /* Takes the array of non-empty beds (i.e. the data
    and merges with a "census" which is a total number of bedspace
    
    In the future, census may also include beds to exclude, i.e. no bed 13*/
  const mergeWithBedCensus = (arr, census) => {
    let resultArray = [];
    for (let i = 0; i < census; i++) {
      resultArray[i] = { bed: i + 1 };
      if (arr) {
        arr.forEach((a) => {
          if (a.bed === i + 1) {
            resultArray[i] = a;
          }
        });
      }
    }
    return resultArray;
  };

  // Load data (either from localStorage or sampleData file)

  /* This is ONLY for development. In production, the persistence of the data would need a better method */
  useEffect(() => {
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
  }, []);

  // Each time data changes, save it to localStorage

  /* We save the data to the 'gridData' variable in the browser's localStorage.
     Remember, since we pull the JSON data in and then immediately store it in our
     program as an Array (for sorting), BEFORE saving we have to convert to back to the regular
     JSON object of objects
  */
  useEffect(() => {
    if (data != null) {
      const dataToSave = JSON.stringify(getJsonObjectFromSortedArray(data));
      localStorage.setItem("gridData", dataToSave);
      console.log(`Saved data to localStorage: ${dataToSave}`);
    }
  }, [data]);

  const handleEditIconClick = (key) => {
    // This is the key of the data array that corresponds to this selected bedspace
    setSelectedKey(key);

    /* When a new bed is selected, copy the truth data's (data) JSON object for this
    selected bedspace to the bedspaceEditorData */
    setBedspaceEditorData(data[key]);
  };

  const handleDeleteIconClick = (key) => {
    let updatedData = [...data];
    let deleted = updatedData.splice(key, 1);
    console.log(`Removed bedspace: ${JSON.stringify(deleted)}`);
    updatedData = mergeWithBedCensus(updatedData, BED_CENSUS);

    setData(updatedData); // set truth data, save to storage
    setBedspaceEditorData(updatedData[selectedKey]); // should clear the bedspaceEditor data
    setNeedsSave(false);
  };

  /* When a change in the BedspaceEditor's data occurs, it
  sends the new bedspace JSON object here.  */
  const handleOnEditorDataChange = (newBedspaceData) => {
    setBedspaceEditorData(newBedspaceData);
    setNeedsSave(true);
  };

  // Receives the new data from the BedspaceView

  /* This is data for a single bedspace that needs to be merged with the
  data object prior to saving */
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

    // sort by bed number again since we've updated the bed data
    const sortedData = sortByBed(updatedData);
    setData(sortedData); // set truth data, save to storage
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

  /* - - - - - RETURN - - - - - */
  if (data != null) {
    return (
      <div>
        <Grid container className={classes.root}>
          <Grid item sm={4}>
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table
                className={classes.table}
                aria-label="simple table"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableHeader}
                      style={{ width: "10%" }}
                    >
                      Bedspace
                    </TableCell>
                    <TableCell
                      className={classes.tableHeader}
                      style={{ width: "30%" }}
                    >
                      Patient
                    </TableCell>
                    <TableCell
                      className={classes.tableHeader}
                      style={{ width: "10%" }}
                    >
                      Team
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((value, key) => {
                      let adjustedKey = key + page * rowsPerPage;
                      return (
                        <TableRow
                          className={classes.tableRow}
                          key={value.bed}
                          hover
                          selected={adjustedKey === selectedKey}
                        >
                          {console.log(adjustedKey)}
                          <TableCell component="th" scope="row">
                            <Grid
                              container
                              className={classes.tableHeaderBedspaceGrid}
                            >
                              <Grid item>
                                <Avatar
                                  variant="rounded"
                                  className={classes.bedNumberAvatar}
                                >
                                  {value.bed}
                                </Avatar>
                              </Grid>
                              <Grid item>
                                {
                                  <Tooltip title="Edit">
                                    <EditIcon
                                      fontSize="small"
                                      onClick={() =>
                                        handleEditIconClick(adjustedKey)
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Tooltip>
                                }
                                {
                                  <Tooltip title="Clear">
                                    <DeleteIcon
                                      fontSize="small"
                                      onClick={() =>
                                        handleDeleteIconClick(adjustedKey)
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Tooltip>
                                }
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell align="left">
                            <span>
                              {value["lastName"]}
                              {value["lastName"] && value["firstName"] && ", "}
                              {value["firstName"]}
                            </span>
                          </TableCell>
                          <TableCell align="left">
                            <span>{value["teamNumber"]}</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Grid>
          <Grid item sm={8}>
            {selectedKey != null && (
              <Grid container>
                <Grid item xs={12}>
                  <BedspaceView data={bedspaceEditorData} />
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
                <Grid item xs={12}>
                  <BedspaceEditor
                    data={bedspaceEditorData}
                    defaultValues={data[selectedKey]}
                    onEditorDataChange={handleOnEditorDataChange}
                    reset={resetBedspaceEditor}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return <>Loading...</>;
  }
};

const BedspaceView = ({ data }) => {
  const classes = useStyles();
  const [thisViewData, setThisViewData] = useState({});

  useEffect(() => {
    setThisViewData(data);
  }, [data]);

  const renderNameComma = () => {
    if (thisViewData.lastName && thisViewData.firstName) {
      return ", ";
    }
  };

  return (
    <>
      <Paper className={classes.demoBox}>
        <div className={classes.demoBoxHeader}>
          <div className={classes.demoBoxHeaderBed}>{thisViewData.bed}</div>
          <div className={classes.demoBoxHeaderName}>
            {thisViewData.lastName}
            {renderNameComma()}
            {thisViewData.firstName}
          </div>
          <div className={classes.demoBoxHeaderTeam}>
            {thisViewData.teamNumber}
          </div>
        </div>
        <div className={classes.demoBoxBody}>
          <div className={classes.demoBoxBodyOneLiner}>
            {thisViewData.oneLiner}
          </div>
          <div className={classes.demoBoxBodyContingencies}>
            {thisViewData.contingencies &&
              thisViewData.contingencies.map((item, index) => {
                return (
                  <div
                    className={classes.demoBoxBodyContingencyItem}
                    key={`${item}-${index}`}
                  >
                    {item}
                  </div>
                );
              })}
          </div>
          {thisViewData.body}
        </div>
      </Paper>
    </>
  );
};

export default UpdatePage;
