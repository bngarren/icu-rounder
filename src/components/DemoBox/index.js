import { useState, useEffect } from "react";
import { Paper, makeStyles, Collapse } from "@material-ui/core";
import StopIcon from "@material-ui/icons/Stop";

import { useSettings } from "../../context/Settings";

import { getWidth } from "../../components/MyDocument";

const useStyles = makeStyles({
  demoBox: {
    position: "relative",
    backgroundColor: "white",
    height: "250pt",
    margin: "auto",
    border: "1px solid #1e1e1e",
    fontSize: "9pt",
    fontFamily: "Roboto",
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
    border: "1pt solid #9a9a9a",
    borderRadius: "2pt",
    padding: "0 2px 0px 2px",
    marginTop: "1pt",
    marginRight: "2pt",
  },
  demoBoxBody: {
    fontSize: "8pt",
    padding: "3px 7px 7px 3px",
    whiteSpace: "pre-line",
  },
  demoBoxNestedContentSectionRoot: {
    marginTop: "1.5px",
  },
  demoBoxNestedContentTopText: {
    minHeight: "5pt",
  },
  demoBoxNestedContentTitle: {
    fontWeight: "bold",
    marginRight: "2px",
  },
  demoBoxNestedContentItemRoot: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "4pt",
  },
  demoBoxNestedContentItemText: {
    marginLeft: "2.5pt",
  },
  demoBoxBottomText: {
    position: "absolute",
    bottom: 0,
    right: 0,
    textAlign: "right",
    fontSize: "8pt",
    padding: "2pt 4pt 2pt 2pt",
  },
});

/* The demo grid box */
const DemoBox = ({ data: propsData, collapsed }) => {
  const classes = useStyles();
  const [data, setData] = useState({});
  const { settings } = useSettings();

  useEffect(() => {
    setData(propsData);
  }, [propsData]);

  const renderNameComma = () => {
    if (data.lastName && data.firstName) {
      return ", ";
    }
  };

  const convertedWidth = getWidth(settings.document_cols_per_page, 1.15);

  return (
    <>
      <Collapse in={!collapsed}>
        <Paper
          className={classes.demoBox}
          style={{ minWidth: convertedWidth, maxWidth: convertedWidth }}
        >
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
            {data.contentType === "simple" && data.simpleContent}
            {data.contentType === "nested" &&
              data.nestedContent?.map((sectionData) => {
                return (
                  <div
                    key={sectionData.id}
                    className={classes.demoBoxNestedContentSectionRoot}
                  >
                    <div className={classes.demoBoxNestedContentTopText}>
                      {sectionData.title && (
                        <span className={classes.demoBoxNestedContentTitle}>
                          {`${sectionData.title}:`}
                        </span>
                      )}
                      {sectionData.top}
                    </div>
                    {sectionData.items.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className={classes.demoBoxNestedContentItemRoot}
                        >
                          <StopIcon style={{ fontSize: "8pt" }} />
                          <span
                            className={classes.demoBoxNestedContentItemText}
                          >
                            {item.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
          <div className={classes.demoBoxBottomText}>{data.bottomText}</div>
        </Paper>
      </Collapse>
    </>
  );
};

export default DemoBox;
