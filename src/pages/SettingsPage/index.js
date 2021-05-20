import { useState, useEffect, useCallback } from "react";
import { useSettings } from "../../context/Settings";

import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import WarningIcon from "@material-ui/icons/Warning";
import {
  Container,
  Grid,
  IconButton,
  Tooltip,
  Zoom,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Divider,
  Button,
} from "@material-ui/core";

// custom components
import Exporter from "../../components/Exporter";
import Importer from "../../components/Importer";

// GridData context
import { useGridStateContext } from "../../context/GridState";

const useStyles = makeStyles({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    marginBottom: 10,
  },
  saveButton: {
    color: "#b7d100",
    transform: "translateY(-5px)",
  },
  inputsGridContainer: {
    flexDirection: "column",
  },
  inputsGridItem: {
    marginBottom: "20px",
  },
  inputLabel: {
    width: "max-content",
    fontSize: "13pt",
  },
  confirmImportButton: {
    color: "white",
    backgroundColor: "#ff4747",
  },
  confirmImportText: {
    color: "#ff4747",
  },
  followingImportText: {
    color: "#b7d100",
  },
});

const SettingsPage = () => {
  const classes = useStyles();
  const { settings, dispatchSettings } = useSettings(); //hook in to the context and reducer
  const { updateGridData } = useGridStateContext();
  const [needsSave, setNeedsSave] = useState(false);
  const [pendingDataImport, setPendingDataImport] = useState(null);
  const [confirmedDataImport, setConfirmedDataImport] = useState(false);

  const [inputValues, setInputValues] = useState();

  const updateInputValuesFromSettings = useCallback((stgs) => {
    setInputValues({
      document_cols_per_page: stgs.document_cols_per_page,
      document_title: stgs.document_title,
    });
  }, []);

  useEffect(() => {
    updateInputValuesFromSettings(settings);
  }, [settings, updateInputValuesFromSettings]);

  const handleOnChange = (target, value) => {
    setInputValues((prevState) => {
      return { ...prevState, [target]: value };
    });
    setNeedsSave(true);
  };

  /* Handling saving of Settings */
  const handleOnSave = (e) => {
    e.preventDefault();
    dispatchSettings({
      type: "UPDATE",
      payload: {
        // TODO Can we just map through the inputValues here?
        document_cols_per_page: inputValues.document_cols_per_page,
        document_title: inputValues.document_title,
      },
    });
    setNeedsSave(false);
  };

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

  if (inputValues) {
    return (
      <Container maxWidth="sm">
        <Grid container className={classes.header}>
          <Typography className={classes.title} variant="h4">
            Settings
          </Typography>
          <Zoom
            in={needsSave}
            timeout={{
              enter: 250,
              exit: 100,
            }}
            unmountOnExit
          >
            <IconButton className={classes.saveButton} onClick={handleOnSave}>
              <Tooltip title="Confirm settings" enterDelay={25}>
                <SaveIcon style={{ fontSize: "25pt" }} />
              </Tooltip>
            </IconButton>
          </Zoom>
        </Grid>

        <Grid container className={classes.inputsGridContainer}>
          <Typography variant="h6">Document</Typography>
          <Grid item className={classes.inputsGridItem}>
            <TextField
              label="Document Title"
              value={inputValues.document_title}
              onChange={(e) => handleOnChange("document_title", e.target.value)}
            />
          </Grid>
          <Grid item className={classes.inputsGridItem}>
            <FormControl>
              <InputLabel
                className={classes.inputLabel}
                shrink
                id="document_cols_per_page_label"
              >
                Grids per row
              </InputLabel>
              <Select
                labelId="document_cols_per_page_label"
                id="document_cols_per_page"
                value={inputValues.document_cols_per_page}
                onChange={(e) =>
                  handleOnChange("document_cols_per_page", e.target.value)
                }
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Divider />
          <Grid item className={classes.inputsGridItem}>
            <Typography variant="h6">Export</Typography>
            <Typography variant="body2">
              Download the current grid as a .json file.
            </Typography>
            <Exporter />
          </Grid>
          <Divider />
          <Grid item className={classes.inputsGridItem}>
            <Typography variant="h6">Import</Typography>
            <Typography variant="body2">
              Upload a previously saved .json file to populate the grid.
            </Typography>

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
                <div>
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
                    (This will overwrite your current grid. Consider exporting
                    it first.)
                  </Typography>
                </div>
              ) : (
                <div>
                  {confirmedDataImport && (
                    <Typography
                      variant="caption"
                      className={classes.followingImportText}
                    >
                      Successfully imported.
                    </Typography>
                  )}
                </div>
              )}
            </div>

            <Importer onNewDataSelected={handleNewDataImported} />
          </Grid>
        </Grid>
      </Container>
    );
  } else {
    return <></>;
  }
};

export default SettingsPage;
