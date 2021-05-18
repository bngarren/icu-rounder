import { useState, useEffect } from "react";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
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
});

/* The demo grid box */
const DemoBox = ({ data: propsData }) => {
  const classes = useStyles();
  const [data, setData] = useState({});

  useEffect(() => {
    setData(propsData);
  }, [propsData]);

  const renderNameComma = () => {
    if (data.lastName && data.firstName) {
      return ", ";
    }
  };

  return (
    <>
      <Paper className={classes.demoBox}>
        <div className={classes.demoBoxHeader}>
          <div className={classes.demoBoxHeaderBed}>{data.bed}</div>
          <div className={classes.demoBoxHeaderName}>
            {data.lastName}
            {renderNameComma()}
            {data.firstName}
          </div>
          <div className={classes.demoBoxHeaderTeam}>{data.teamNumber}</div>
        </div>
        <div className={classes.demoBoxBody}>
          <div className={classes.demoBoxBodyOneLiner}>{data.oneLiner}</div>
          <div className={classes.demoBoxBodyContingencies}>
            {data.contingencies &&
              data.contingencies.map((item, index) => {
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
          {data.body}
        </div>
      </Paper>
    </>
  );
};

export default DemoBox;
