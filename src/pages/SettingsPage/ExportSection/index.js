import * as React from "react";

// MUI
import { Grid, InputAdornment, Typography, Button } from "@mui/material";

// Custom components
import CustomTextField from "../CustomTextField";
import Exporter from "../../../components/Exporter";
import CustomFormControlSetting from "../../../components/CustomFormControl/CustomFormControlSetting";
import ExportList from "./ExportList";

// Context
import { useSettings } from "../../../context/Settings";

const ExportSection = ({ onSave = (f) => f }) => {
  /* This is what we will actually send to the Exporter component */
  const [gridDataToExport, setGridDataToExport] = React.useState([]);

  /* Handles when the ExportList component changes its selection. This
  prepares a new slice of data to be exported. */
  const onNewSelectionOfItemsToExport = React.useCallback((selectedItems) => {
    setGridDataToExport(selectedItems);
  }, []);

  /* Get Settings context */
  const { settings } = useSettings();

  const handleOnExport = () => {};

  return (
    <>
      <Grid item>
        <CustomFormControlSetting
          label="Filename"
          id="export_filename"
          initialValue={settings.export_filename}
          onSave={onSave}
        >
          <CustomTextField
            id="exportFilenameTextField"
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingRight: 0,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "center",
                    padding: "6px 6px 6px 3px",
                    margin: 0,
                  }}
                >
                  <Typography variant="caption">.json</Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{
              sx: {
                textAlign: "right",
                paddingRight: "3px",
              },
            }}
          />
        </CustomFormControlSetting>

        <Exporter
          filename={settings.export_filename}
          onExported={handleOnExport}
          gridDataToExport={gridDataToExport}
        >
          <Button variant="contained" disableElevation size="small">
            Export Grid
          </Button>
        </Exporter>
        <ExportList onChangeSelected={onNewSelectionOfItemsToExport} />
      </Grid>
    </>
  );
};

export default ExportSection;
