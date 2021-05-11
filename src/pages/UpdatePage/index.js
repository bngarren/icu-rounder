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
  Typography,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import sampleData from "../../data/data.json";

const useStyles = makeStyles({
  tableContainer: {
    margin: "10 10",
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    backgroundColor: "rgb(0, 39, 168)",
    color: "white",
  },
  bedspaceViewGridContainer: {
    width: "100%",
    marginTop: "20px",
  },
  bedspaceViewGridLeft: {
    padding: "4px",
  },
  bedspaceViewGridRight: {},
  demoBox: {
    whiteSpace: "pre-line",
    border: "2px solid black",
    height: "400px",
  },
  demoBoxHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    borderBottom: "1pt solid black",
    "&:hover": {
      backgroundColor: "#f24f21",
    },
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
    fontSize: "0.8rem",
    padding: "1px",
    "&:hover": {
      backgroundColor: "#f24f21",
    },
  },
  demoBoxBodyOneLiner: {
    marginBottom: "4px",
  },
});

const BED_CENSUS = 30;

const UpdatePage = () => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [selectedKey, setSelectedKey] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const sortByBed = (arr) => {
    // sorts by bed number in ascending order
    return arr.sort((el1, el2) => {
      return el1.bed - el2.bed;
    });
  };

  const getJsonObjectFromSortedArray = (arr) => {
    const result = {};
    arr.forEach((b) => {
      result[b.bed] = b;
    });
    return result;
  };

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

  const handleRowClick = (event, key) => {
    console.log(`clicked ${data[key]["lastName"]}`);
    setSelectedKey(key);
  };

  // Receives the new data from the BedspaceView

  /* This is data for a single bedspace that needs to be merged with the
  data object prior to saving */
  const handleOnSave = (newBedspaceData, e) => {
    const updatedData = [...data];
    const objIndex = updatedData.findIndex(
      (obj) => obj.bed === newBedspaceData.bed
    );

    if (objIndex >= 0) {
      updatedData[objIndex] = newBedspaceData;
    } else {
      updatedData.push(newBedspaceData);
    }

    setData(sortByBed(updatedData));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  if (data != null) {
    return (
      <div>
        <Paper>
          <TableContainer className={classes.tableContainer}>
            <Table
              className={classes.table}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Bedspace
                  </TableCell>
                  <TableCell className={classes.tableHeader} align="left">
                    Patient
                  </TableCell>
                  <TableCell className={classes.tableHeader} align="left">
                    Team
                  </TableCell>
                  <TableCell className={classes.tableHeader} align="left">
                    One Liner
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((value, key) => (
                    <TableRow
                      key={value.bed}
                      onClick={(event) => handleRowClick(event, key)}
                      hover
                      selected={key === selectedKey}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="h5">{value.bed}</Typography>
                        {key === selectedKey && <EditIcon />}
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="h6">
                          {value["lastName"]}
                          {value["lastName"] && value["firstName"] && ", "}
                          {value["firstName"]}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="h6">
                          {value["teamNumber"]}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body2">
                          {value["oneLiner"]}
                        </Typography>
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
        </Paper>

        {selectedKey != null && (
          <BedspaceView
            bedspace={data[selectedKey]}
            onClickSave={handleOnSave}
          />
        )}
      </div>
    );
  } else {
    return <>Loading...</>;
  }
};

const BedspaceView = ({ bedspace, onClickSave = (f) => f }) => {
  const classes = useStyles();
  const [selectedDemoBoxComponent, setSelectedDemoBoxComponent] = useState();
  const [thisViewData, setThisViewData] = useState({});
  const [needsSave, setNeedsSave] = useState(false);

  useEffect(() => {
    setThisViewData(bedspace);
  }, [bedspace]);

  const onClickDemoBoxEdit = (value, event) => {
    setSelectedDemoBoxComponent(value);
  };

  const handleOnDataChange = (newData) => {
    setThisViewData(newData);
    setNeedsSave(true);
  };

  const renderEditBoxSwitch = (value) => {
    switch (value) {
      case "header":
        return (
          <EditBoxHeader
            data={thisViewData}
            onDataChange={handleOnDataChange}
          />
        );
      case "body":
        return (
          <EditBoxBody data={thisViewData} onDataChange={handleOnDataChange} />
        );
      default:
        return "Error: Undefined component to edit";
    }
  };

  return (
    <Grid container className={classes.bedspaceViewGridContainer}>
      <Grid item xs={12}>
        {needsSave && (
          <Button onClick={(dataToSave, e) => onClickSave(thisViewData, e)}>
            Save
          </Button>
        )}
      </Grid>
      <Grid item md={5} className={classes.bedspaceViewGridLeft}>
        <div className={classes.demoBox}>
          <div
            className={classes.demoBoxHeader}
            onClick={(e) => onClickDemoBoxEdit("header", e)}
          >
            <div className={classes.demoBoxHeaderBed}>{thisViewData.bed}</div>
            <div className={classes.demoBoxHeaderName}>
              {thisViewData.lastName}
              {thisViewData.lastName !== "" &&
                thisViewData.firstName !== "" &&
                ","}{" "}
              {thisViewData.firstName}
            </div>
            <div className={classes.demoBoxHeaderTeam}>
              {thisViewData.teamNumber}
            </div>
          </div>
          <div
            className={classes.demoBoxBody}
            onClick={(e) => onClickDemoBoxEdit("body", e)}
          >
            <div className={classes.demoBoxBodyOneLiner}>
              {thisViewData.oneLiner}
            </div>
            {thisViewData.body}
          </div>
        </div>
      </Grid>
      <Grid item md={7} className={classes.bedspaceViewGridRight}>
        {selectedDemoBoxComponent != null && (
          <div className={classes.editBox}>
            {renderEditBoxSwitch(selectedDemoBoxComponent)}
          </div>
        )}
      </Grid>
    </Grid>
  );
};

const EditBoxHeader = ({ data, onDataChange = (f) => f }) => {
  const [inputBedNumberValue, setInputBedNumberValue] = useState(0);
  const [inputLastNameValue, setInputLastNameValue] = useState("");
  const [inputFirstNameValue, setInputFirstNameValue] = useState("");

  useEffect(() => {
    if (data.bed) {
      setInputBedNumberValue(data.bed);
    }

    if (data.lastName) {
      setInputLastNameValue(data.lastName);
    }

    if (data.firstName) {
      setInputFirstNameValue(data.firstName);
    }
  }, [data]);

  const handleInputBedNumberChange = (value) => {
    onDataChange({
      ...data,
      bed: value,
    });
    setInputBedNumberValue(value);
  };

  const handleInputLastNameChange = (value) => {
    const newLastName = value.trim();
    onDataChange({
      ...data,
      lastName: newLastName,
    });
    setInputLastNameValue(newLastName);
  };

  const handleInputFirstNameChange = (value) => {
    const newFirstName = value.trim();
    onDataChange({
      ...data,
      firstName: newFirstName,
    });
    setInputFirstNameValue(newFirstName);
  };

  return (
    <form autoComplete="off">
      <TextField
        label="Bed"
        value={inputBedNumberValue}
        onChange={(e) => handleInputBedNumberChange(e.target.value)}
      ></TextField>
      <TextField
        label="Last Name"
        value={inputLastNameValue}
        onChange={(e) => handleInputLastNameChange(e.target.value)}
      ></TextField>
      <TextField
        label="First Name"
        value={inputFirstNameValue}
        onChange={(e) => handleInputFirstNameChange(e.target.value)}
      ></TextField>
    </form>
  );
};

const EditBoxBody = ({ data, onDataChange = (f) => f }) => {
  const [inputOneLinerValue, setInputOneLinerValue] = useState("");
  const [inputBodyValue, setInputBodyValue] = useState("");

  useEffect(() => {
    if (data.oneLiner != null) {
      setInputOneLinerValue(data.oneLiner);
    }
    if (data.body != null) {
      setInputBodyValue(data.oneLiner);
    }
  }, [data]);

  const handleInputOneLinerChange = (value) => {
    let newOneLiner = value;
    setInputOneLinerValue(newOneLiner);
    onDataChange({
      ...data,
      oneLiner: newOneLiner,
    });
  };

  const handleInputBodyChange = (value) => {
    let newBody = value;
    setInputBodyValue(newBody);
    onDataChange({
      ...data,
      body: newBody,
    });
  };

  return (
    <form autoComplete="off">
      <TextField
        label="One Liner"
        value={inputOneLinerValue}
        onChange={(e) => handleInputOneLinerChange(e.target.value)}
      ></TextField>
      <br></br>
      <TextField
        multiline
        rows={4}
        variant="outlined"
        label="Body"
        value={inputBodyValue}
        onChange={(e) => handleInputBodyChange(e.target.value)}
      ></TextField>
    </form>
  );
};

export default UpdatePage;
