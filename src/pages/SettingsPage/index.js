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
import { useDialog } from "../../components/Dialog";

// GridData context
import { useGridStateContext } from "../../context/GridState";

// Utility
import { isBedEmpty, getDataForBed } from "../../utils/Utility";

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
  textFieldRoot: {
    border: "1px solid #e2e2e1",
    overflow: "hidden",
    borderRadius: "3px",
    backgroundColor: "white",
    paddingLeft: "6px",
    "&:hover": {
      backgroundColor: "white",
    },
    "&$textFieldFocused": {
      backgroundColor: "#fff",
      borderColor: "#b7d100",
    },
  },
  textFieldFocused: {},
  textFieldInputLabelRoot: {
    color: "#9caa3d",
    fontSize: "11pt",
    "&$textFieldInputLabelFocused": {
      color: "#094D92",
    },
  },
  textFieldInputLabelFocused: {},
  selectInputLabel: {
    width: "max-content",
    fontSize: "13pt",
  },
  exportFilenameTextfieldInput: {
    textAlign: "right",
    paddingRight: "4px",
  },
  textEndAdornment: {
    backgroundColor: "#dcdcdc",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    padding: "0 3px",
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

const CustomTextField = ({
  id,
  customStyle: classes,
  InputProps,
  inputProps,
  ...props
}) => {
  return (
    <TextField
      InputProps={{
        ...InputProps,
        classes: {
          root: classes.textFieldRoot,
          focused: classes.textFieldFocused,
        },
        disableUnderline: true,
        inputProps: {
          ...inputProps,
          style: { fontSize: "11pt" },
        },
      }}
      InputLabelProps={{
        classes: {
          root: classes.textFieldInputLabelRoot,
          focused: classes.textFieldInputLabelFocused,
        },
      }}
      id={id}
      {...props}
    />
  );
};

const SettingsPage = () => {
  const classes = useStyles();
  const { settings, dispatchSettings } = useSettings(); //hook in to the context and reducer

  const { bedLayout, gridData, updateGridData } = useGridStateContext();
  const [needsSave, setNeedsSave] = useState(false);
  const [pendingDataImport, setPendingDataImport] = useState(null);
  const [confirmedDataImport, setConfirmedDataImport] = useState(false);

  const [inputValues, setInputValues] = useState(); // controlled inputs

  /* Hook for our Dialog modal */
  const { dialogIsOpen, dialog, showYesNoDialog } = useDialog();

  /* Helper function to update our input fields with default values */
  const updateInputValuesFromStored = useCallback((stgs, bl) => {
    /* Since bedLayout is stored as an array, we use the
    reduce function to prettify it for the text input */
    let prettyBedLayout;
    if (bl && bl.length > 0) {
      bl.sort((el1, el2) => {
        return el1.localeCompare(el2, "en", { numeric: true });
      });
      prettyBedLayout = bl.reduce((accum, current) => {
        return `${accum}, ${current}`;
      });
    } else {
      prettyBedLayout = bl;
    }

    setInputValues({
      document_cols_per_page: stgs.document_cols_per_page,
      document_title: stgs.document_title,
      bedLayout: prettyBedLayout,
      export_filename: stgs.export_filename,
    });
  }, []);

  /* Any time the saved/store settings changes, the values for
  the inputs will update to reflect it */
  useEffect(() => {
    updateInputValuesFromStored(settings, bedLayout);
  }, [
    settings.document_cols_per_page,
    settings.document_title,
    settings.export_filename,
    settings,
    bedLayout,
    updateInputValuesFromStored,
  ]);

  /* Helper function for taking the input bedLayout (CSV format) and 
  converting it to a valid array */
  const getFormattedBedLayout = () => {
    let val = inputValues.bedLayout;
    let res = [];
    if (val == null || val === "") return res;
    let arr = val.split(",");
    arr.forEach((element) => {
      if (element === "") return;
      res.push(element.trim());
    });
    return res;
  };

  const handleOnChange = (target, value) => {
    setInputValues((prevState) => {
      return { ...prevState, [target]: value };
    });
    setNeedsSave(true);
  };

  /* Save the new bedLayout
  ! Need to check if beds with data will be dropped--if so alert user */
  const handleSaveBedLayout = () => {
    const formattedBedLayout = getFormattedBedLayout();

    /* Find the beds that differ between the current and new bedLayouts */
    let difference = bedLayout.filter((x) => !formattedBedLayout.includes(x));
    /* Of these beds, if any, find which ones have patient data at risk of being deleted */
    let riskBeds = [];
    if (difference.length > 0) {
      difference.forEach((i) => {
        // Uses Utility function to get the bed's data and see if it's empty
        if (!isBedEmpty(getDataForBed(gridData, i))) {
          riskBeds.push(i);
        }
      });
    }
    // If there are bed(s) with data that are missing from new bedLayout
    if (riskBeds.length > 0) {
      // Construct the message for the Dialog
      const content = (
        <div>
          <p>
            This new bed layout will <b>NOT</b> include the following beds which
            are non-empty:
          </p>
          <p>
            {riskBeds.map((i) => {
              return `| ${i} |     `;
            })}
          </p>
        </div>
      );
      showYesNoDialog(
        content,
        () => {
          // chose to continue
          updateGridData(gridData, formattedBedLayout);
        },
        () => {
          // chose to cancel
          return;
        },
        { yes: "Continue", no: "Cancel" }
      );
    } else {
      updateGridData(gridData, formattedBedLayout);
    }
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
        export_filename: inputValues.export_filename,
      },
    });
    handleSaveBedLayout();
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
          <Typography variant="h6">General</Typography>
          <Grid item className={classes.inputsGridItem}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
              }}
            >
              <CustomTextField
                id="bedLayoutTextField"
                customStyle={classes}
                label="Bed Layout"
                value={inputValues.bedLayout}
                onChange={(e) => handleOnChange("bedLayout", e.target.value)}
                fullWidth
                multiline
              />
            </div>
          </Grid>
          <Typography variant="h6">Document</Typography>
          <Grid item className={classes.inputsGridItem}>
            <CustomTextField
              id="documentTitleTextField"
              customStyle={classes}
              label="Document Title"
              value={inputValues.document_title}
              onChange={(e) => handleOnChange("document_title", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item className={classes.inputsGridItem}>
            <FormControl>
              <InputLabel
                className={classes.selectInputLabel}
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CustomTextField
                id="exportFilenameTextField"
                customStyle={classes}
                label="Filename"
                value={inputValues.export_filename}
                onChange={(e) =>
                  handleOnChange("export_filename", e.target.value)
                }
                InputProps={{
                  endAdornment: (
                    <div className={classes.textEndAdornment}>
                      <Typography variant="caption">.json</Typography>
                    </div>
                  ),
                }}
                inputProps={{
                  className: classes.exportFilenameTextfieldInput,
                }}
              />
              <Exporter filename={inputValues.export_filename} />
            </div>
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
        {dialogIsOpen && dialog}
      </Container>
    );
  } else {
    return <></>;
  }
};

export default SettingsPage;
