// MUI
import { Grid } from "@mui/material";

// Custom components
import CustomTextField from "../CustomTextField";
import CustomFormControlSetting from "../../../components/CustomFormControl/CustomFormControlSetting";

// Context
import { useGridStateContext } from "../../../context/GridState";

// Util
import { getPrettyBedLayout } from "../../../utils/Utility";

const GeneralSection = ({ onSave = (f) => f }) => {
  /* Get GridData and BedLayout from context */
  const { bedLayout } = useGridStateContext();

  return (
    <>
      <Grid item>
        <CustomFormControlSetting
          label="Bed Layout"
          id="bedLayout"
          initialValue={getPrettyBedLayout(bedLayout)}
          onSave={onSave}
        >
          <CustomTextField id="bedLayoutTextField" fullWidth multiline />
        </CustomFormControlSetting>
      </Grid>
    </>
  );
};

export default GeneralSection;
