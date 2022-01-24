//import {  } from "react";

// Material UI
import { Grid, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

// Custom components
import CustomTextField from "../CustomTextField";
import Exporter from "../../../components/Exporter";
import CustomFormControlSetting from "../../../components/CustomFormControl/CustomFormControlSetting";

// Context
import { useSettings } from "../../../context/Settings";

const useStyles = makeStyles((theme) => ({
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
}));

const ExportSection = ({ parentCss, onSave = (f) => f }) => {
  const classes = useStyles();

  /* Get Settings context */
  const { settings } = useSettings();

  const handleOnExport = () => {};

  return (
    <>
      <Grid item className={parentCss.sectionGridItem}>
        <CustomFormControlSetting
          label="Filename"
          id="export_filename"
          initialValue={settings.export_filename}
          onSave={onSave}
        >
          <CustomTextField
            id="exportFilenameTextField"
            style={{ maxWidth: "300px", minWidth: "100px" }}
            endAdornment={
              <div className={classes.textEndAdornment}>
                <Typography variant="caption">.json</Typography>
              </div>
            }
            inputProps={{
              className: classes.exportFilenameTextfieldInput,
            }}
          />
        </CustomFormControlSetting>
        <br />
        <Exporter
          filename={settings.export_filename}
          onExported={handleOnExport}
        >
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            size="small"
          >
            Export Grid
          </Button>
        </Exporter>
      </Grid>
    </>
  );
};

export default ExportSection;
