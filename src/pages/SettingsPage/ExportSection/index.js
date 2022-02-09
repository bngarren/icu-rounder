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
        >
          <Button variant="contained" disableElevation size="small">
            Export Grid
          </Button>
        </Exporter>
        <ExportList />
      </Grid>
    </>
  );
};

export default ExportSection;
