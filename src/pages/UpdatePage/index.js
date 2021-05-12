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
  TextField,
  Button,
  Toolbar,
  Avatar,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import BedspaceEditor from "../../components/BedspaceEditor";

import sampleData from "../../data/data.json";

const useStyles = makeStyles({
  tableContainer: {
    margin: "10 10",
  },
  table: {
    minWidth: "400px",
  },
  tableHeader: {
    backgroundColor: "black",
    color: "white",
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
    width: "200pt",
    height: "150pt",
    margin: "auto",
    border: "2px solid black",
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
    paddingLeft: "4px",
    paddingRight: "4px",
    borderRight: "1px solid black",
    fontWeight: "bold",
  },
  demoBoxHeaderName: {
    flexGrow: "4",
  },
  demoBoxHeaderTeam: {
    alignSelf: "flex-end",
    marginLeft: "4px",
    paddingLeft: "4px",
    paddingRight: "4px",
    borderLeft: "1px solid black",
  },
  demoBoxBody: {
    fontSize: "8pt",
    padding: "3px",
    whiteSpace: "pre-line",
  },
  demoBoxBodyOneLiner: {
    marginBottom: "4px",
  },
  bedspaceEditorToolbar: {
    backgroundColor: "white",
    borderBottom: "2px solid black",
  },
  saveButton: {
    backgroundColor: "#dcdcdc",
    color: "black",
    "&:hover": {
      backgroundColor: "yellow",
    },
  },
});

const BED_CENSUS = 30;

const UpdatePage = () => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [bedspaceEditorData, setBedspaceEditorData] = useState();
  const [selectedKey, setSelectedKey] = useState();
  const [needsSave, setNeedsSave] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const sortByBed = (arr) => {
    // sorts by bed number in ascending order
    return arr.sort((el1, el2) => {
      return el1.bed - el2.bed;
    });
  };

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
    setData(mergeWithBedCensus(updatedData, BED_CENSUS));
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
    const objIndex = updatedData.findIndex(
      (obj) => obj.bed === bedspaceEditorData.bed
    );

    if (objIndex >= 0) {
      updatedData[objIndex] = bedspaceEditorData;
    } else {
      updatedData.push(bedspaceEditorData);
    }

    setData(sortByBed(updatedData));
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

  if (data != null) {
    return (
      <div>
        <Grid container>
          <Grid item sm={5}>
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
                    .map((value, key) => (
                      <TableRow
                        key={value.bed}
                        hover
                        selected={key === selectedKey}
                      >
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
                                    onClick={() => handleEditIconClick(key)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </Tooltip>
                              }
                              {
                                <Tooltip title="Clear">
                                  <DeleteIcon
                                    fontSize="small"
                                    onClick={() => handleDeleteIconClick(key)}
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
                    ))}
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
          <Grid item sm={7}>
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
                    <Button
                      className={classes.saveButton}
                      size="small"
                      disabled={!needsSave}
                      onClick={(e) => handleOnSave(e)}
                    >
                      Save
                    </Button>
                  </Toolbar>
                </Grid>
                <Grid item xs={12}>
                  <BedspaceEditor
                    data={bedspaceEditorData}
                    defaultValues={data[selectedKey]}
                    onEditorDataChange={handleOnEditorDataChange}
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
          {thisViewData.body}
        </div>
      </Paper>
    </>
  );
};

export default UpdatePage;
