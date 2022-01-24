import { useState, useCallback } from "react";

// Material UI
import { Grid, Typography, Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { makeStyles } from "@mui/styles";

// Custom components
import Importer from "../../../components/Importer";

// GridData context
import { useGridStateContext } from "../../../context/GridState";

const useStyles = makeStyles((theme) => ({
  confirmImportButton: {
    color: "white",
    backgroundColor: theme.palette.warning.main,
  },
  confirmImportText: {
    color: theme.palette.warning.main,
  },
  followingImportText: {
    color: theme.palette.primary.main,
    fontSize: "11pt",
  },
  followingImportIcon: {
    color: theme.palette.primary.main,
    fontSize: "13pt",
    marginRight: "2px",
  },
}));

const ImportSection = ({ parentCss }) => {
  const classes = useStyles();

  /* Use this hook to updateGridData once new data is imported */
  const { updateGridData } = useGridStateContext();

  // We have uploaded a file but not "imported" the data until confirmed
  const [pendingDataImport, setPendingDataImport] = useState(null);

  // We have confirmed the import. The new data is now the gridData
  const [confirmedDataImport, setConfirmedDataImport] = useState(false);

  /* New data has been uploaded using the Importer component,
  now awaiting confirmation */
  const handleNewDataImported = useCallback((data) => {
    if (!data) return;
    setPendingDataImport(data);
    setConfirmedDataImport(false);
  }, []);

  /* Imported data has been confirmed to overwrite the existing gridData */
  const handleUpdateGridData = (data) => {
    updateGridData(data);
    setPendingDataImport(null);
    setConfirmedDataImport(true);
  };

  return (
    <>
      <Grid item className={parentCss.sectionGridItem}>
        <Importer onNewDataSelected={handleNewDataImported} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            alignItems: "center",
            margin: "5px 0px",
          }}
        >
          {pendingDataImport ? (
            <div align="center">
              <Button
                className={classes.confirmImportButton}
                variant="contained"
                size="small"
                onClick={() => handleUpdateGridData(pendingDataImport)}
                startIcon={<WarningIcon />}
              >
                Use this data?
              </Button>
              <Typography
                variant="caption"
                className={classes.confirmImportText}
              >
                <br />
                (This will overwrite your current grid. Consider exporting it
                first.)
              </Typography>
            </div>
          ) : (
            <div>
              {confirmedDataImport && (
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  <CheckBoxIcon className={classes.followingImportIcon} />
                  <Typography
                    variant="caption"
                    className={classes.followingImportText}
                  >
                    Successfully imported.
                  </Typography>
                </div>
              )}
            </div>
          )}
        </div>
      </Grid>
    </>
  );
};

export default ImportSection;
