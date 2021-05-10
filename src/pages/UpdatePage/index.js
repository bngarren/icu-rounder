import { useState, useEffect } from "react";

import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
} from "@material-ui/core";

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
  },
  demoBoxBodyOneLiner: {
    marginBottom: "4px",
  },
});

const UpdatePage = () => {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [selectedKey, setSelectedKey] = useState();

  const sortByKey = (obj) => {
    var sortedArray = [];
    for (var i in obj) {
      sortedArray.push([i, obj[i]]);
    }
    return sortedArray.sort();
  };

  useEffect(() => {
    const getData = async () => {
      const resultJSON = await JSON.parse(JSON.stringify(sampleData));

      setData(sortByKey(resultJSON));
    };
    getData();
  }, []);

  const handleRowClick = (event, key) => {
    console.log(`clicked ${data[key][1]["lastName"]}`);
    setSelectedKey(key);
  };

  const onClickSave = (e) => {};

  const onClickSelectBedspace = (e) => {};

  if (data != null) {
    return (
      <div>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table
            className={classes.table}
            aria-label="simple table"
            size="small"
          >
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeader}>Bedspace</TableCell>
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
              {data.map((value, key) => (
                <TableRow
                  key={value[0]}
                  onClick={(event) => handleRowClick(event, key)}
                  hover
                  selected={key === selectedKey}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="h5">{value[0]}</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="h6">
                      {value[1]["lastName"]}, {value[1]["firstName"]}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="h6">
                      {value[1]["teamNumber"]}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2">
                      {value[1]["oneLiner"]}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedKey != null && <BedspaceView bedspace={data[selectedKey]} />}
      </div>
    );
  } else {
    return <>Loading...</>;
  }
};

const BedspaceView = ({ bedspace }) => {
  const classes = useStyles();

  const data = bedspace[1];

  return (
    <Grid container className={classes.bedspaceViewGridContainer}>
      <Grid item md="5" className={classes.bedspaceViewGridLeft}>
        <div className={classes.demoBox}>
          <div className={classes.demoBoxHeader}>
            <div className={classes.demoBoxHeaderBed}>{data.bed}</div>
            <div className={classes.demoBoxHeaderName}>
              {data.lastName}, {data.firstName}
            </div>
            <div className={classes.demoBoxHeaderTeam}>{data.teamNumber}</div>
          </div>
          <div className={classes.demoBoxBody}>
            <div className={classes.demoBoxBodyOneLiner}>{data.oneLiner}</div>
            {data.body}
          </div>
        </div>
      </Grid>
      <Grid item md="7" className={classes.bedspaceViewGridRight}>
        Input Form
      </Grid>
    </Grid>
  );
};

export default UpdatePage;
