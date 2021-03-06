import * as React from "react";

// MUI
import { Box, Stack, InputAdornment, Typography, Button } from "@mui/material";

// Custom components
import CustomTextField from "../CustomTextField";
import Exporter from "../../../components/Exporter";
import CustomFormControlSetting from "../../../components/CustomFormControl/CustomFormControlSetting";
import ExportList from "./ExportList";

// Context
import { useSettings } from "../../../context/Settings";

/* Section of SettingsPage that handles exporting the grid to JSON */
/**
 *
 * @param {func} onSave Callback function when a setting is saved.
 */
const ExportSection = ({ onSave = (f) => f }) => {
  const { settings } = useSettings();

  /* This is what we will actually send to the Exporter component */
  const [gridDataToExport, setGridDataToExport] = React.useState([]);

  /* Handles when the ExportList component changes its selection. This
  prepares a new slice of data to be exported. */
  const onNewSelectionOfItemsToExport = React.useCallback((selectedItems) => {
    setGridDataToExport(selectedItems);
  }, []);

  /* Error when there are no items selected to export */
  const error = gridDataToExport.length < 1;

  const handleOnExport = () => {};

  return (
    <Box>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-end" }}>
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
            {/* //! Button's padding is kinda hard coded to match nearby TextField */}
            <Button
              variant="contained"
              disableElevation
              size="small"
              sx={{ p: "5.3px 10px" }}
              disabled={error}
            >
              Export Grid
            </Button>
          </Exporter>
        </Stack>
        <ExportList onChangeSelected={onNewSelectionOfItemsToExport} />
      </Stack>
    </Box>
  );
};

export default ExportSection;
