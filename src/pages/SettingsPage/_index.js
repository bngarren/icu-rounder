import { useState, useEffect, useCallback } from "react";

import SaveIcon from "@material-ui/icons/Save";
import WarningIcon from "@material-ui/icons/Warning";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import {
  Container,
  Grid,
  IconButton,
  Tooltip,
  Zoom,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  InputBase,
  Divider,
  Button,
  createSvgIcon,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// custom components
import Exporter from "../../components/Exporter";
import Importer from "../../components/Importer";
import ContingencyOptionsEditor from "../../components/ContingencyOptionsEditor";
import CustomFormControl from "../../components/CustomFormControl";
import { useDialog } from "../../components/Dialog";

// context
import { useSettings } from "../../context/Settings";

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
    marginBottom: 15,
  },
  sectionTitle: {
    marginTop: "5px",
    marginBottom: "10px",
    fontWeight: "bold",
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
  inputLabel: {
    color: "#828181",
    fontSize: "10.5pt",
    marginBottom: "4px",
    paddingLeft: "2px",
  },
  selectInputRoot: {
    paddingLeft: "5px",
  },
  selectInputSelect: {
    "&:focus": {
      backgroundColor: "transparent",
    },
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
    padding: "6px 3px",
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
    fontSize: "11pt",
  },
  followingImportIcon: {
    color: "#b7d100",
    fontSize: "13pt",
    marginRight: "2px",
  },
});

const SettingsPage = () => {
  const classes = useStyles();

  /* Get Settings context */
  const { settings, dispatchSettings } = useSettings();

  /* Get GridData and BedLayout from context */
  const { bedLayout, gridData, updateGridData } = useGridStateContext();

  const [contingencyOptions, setContingencyOptions] = useState(
    settings.contingencyOptions ? settings.contingencyOptions : null
  );

  /* Import .json functionality */
  const [pendingDataImport, setPendingDataImport] = useState(null);
  const [confirmedDataImport, setConfirmedDataImport] = useState(false);

  /* Hook for our Dialog modal */
  const { dialogIsOpen, dialog, showYesNoDialog } = useDialog();

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

  const handleOnExport = () => {};

  /* New contingency option added */
  const handleNewContingencyOption = (val) => {
    dispatchSettings({
      type: "UPDATE",
      payload: {
        contingencyOptions: [...contingencyOptions, val],
      },
    });
  };

  /* Removed a contingency option  */
  const handleRemoveContingenyOption = (i) => {
    let newArray = [...contingencyOptions];
    newArray.splice(i, 1);
    dispatchSettings({
      type: "UPDATE",
      payload: {
        contingencyOptions: newArray,
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Grid container className={classes.header}>
        <Typography className={classes.title} variant="h4">
          Settings
        </Typography>
      </Grid>

      <Grid container className={classes.inputsGridContainer}>
        <Typography className={classes.sectionTitle} variant="h6">
          General
        </Typography>
        <Grid item className={classes.inputsGridItem}>
          <CustomFormControl initialValue={getPrettyBedLayout(bedLayout)}>
            <CustomTextField
              id="bedLayoutTextField"
              customStyle={classes}
              label="Bed Layout"
              fullWidth
              multiline
            />
          </CustomFormControl>
        </Grid>
        <Divider />
        <Typography className={classes.sectionTitle} variant="h6">
          Document
        </Typography>
        <Grid item className={classes.inputsGridItem}>
          <CustomFormControl initialValue={settings.document_title}>
            <CustomTextField
              id="documentTitleTextField"
              customStyle={classes}
              label="Title"
              fullWidth
            />
          </CustomFormControl>
        </Grid>
        <Grid item className={classes.inputsGridItem}>
          <InputLabel
            className={classes.inputLabel}
            id="document_cols_per_page_label"
            shrink={false}
          >
            Grids per row
          </InputLabel>
          <CustomFormControl initialValue={settings.document_cols_per_page}>
            <Select
              labelId="document_cols_per_page_label"
              id="document_cols_per_page"
              classes={{
                root: classes.selectInputRoot,
                select: classes.selectInputSelect,
              }}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </CustomFormControl>
        </Grid>
        <Divider />
        <Grid item className={classes.inputsGridItem}>
          <Typography className={classes.sectionTitle} variant="h6">
            Export
          </Typography>
          <Typography variant="body2">
            Download the current grid as a .json file.
          </Typography>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-end",
            }}
          >
            <CustomFormControl initialValue={settings.export_filename}>
              <CustomTextField
                id="exportFilenameTextField"
                customStyle={classes}
                style={{ maxWidth: "300px", minWidth: "100px" }}
                label="Filename"
                endAdornment={
                  <div className={classes.textEndAdornment}>
                    <Typography variant="caption">.json</Typography>
                  </div>
                }
                inputProps={{
                  className: classes.exportFilenameTextfieldInput,
                }}
              />
            </CustomFormControl>
            <Exporter
              filename={settings.export_filename}
              onExported={handleOnExport}
            >
              <Button>Export Grid</Button>
            </Exporter>
          </div>
        </Grid>
        <Divider />
        <Grid item className={classes.inputsGridItem}>
          <Typography className={classes.sectionTitle} variant="h6">
            Import
          </Typography>
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

          <Importer onNewDataSelected={handleNewDataImported} />
        </Grid>
        <Divider />
        <Grid item className={classes.inputsGridItem}>
          <Typography className={classes.sectionTitle} variant="h6">
            Contingencies
          </Typography>
          <Typography variant="body2">
            Save your custom contingencies for later use.
          </Typography>
          <ContingencyOptionsEditor
            data={contingencyOptions}
            onSubmit={handleNewContingencyOption}
            onRemove={handleRemoveContingenyOption}
          />
        </Grid>
      </Grid>
      {dialogIsOpen && dialog}
    </Container>
  );
};

const CustomTextField = ({
  id,
  customStyle: classes,
  inputProps,
  label,
  ...props
}) => {
  return (
    <div>
      <InputLabel
        classes={{
          root: classes.inputLabel,
        }}
      >
        {label}
      </InputLabel>
      <InputBase
        classes={{
          root: classes.textFieldRoot,
          focused: classes.textFieldFocused,
        }}
        inputProps={{
          ...inputProps,
          style: { fontSize: "11pt" },
        }}
        {...props}
      />
    </div>
  );
};

/* Helper function - Since bedLayout is stored as an array, we use the
    reduce function to prettify it for the text input */
const getPrettyBedLayout = (bl) => {
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
  return prettyBedLayout;
};

/* Helper function for taking the input bedLayout (CSV format) and 
  converting it to a valid array */
const getBedLayoutArrayFromCsv = (csv) => {
  let res = [];
  if (csv == null || csv === "") return res;
  let arr = csv.split(",");
  arr.forEach((element) => {
    if (element === "") return;
    res.push(element.trim());
  });
  return res;
};

export default SettingsPage;
