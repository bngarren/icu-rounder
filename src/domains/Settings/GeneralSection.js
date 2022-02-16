// MUI
import { Box } from "@mui/material";

// Custom components
import CustomTextField from "./CustomTextField";
import CustomFormControlSetting from "./CustomFormControlSetting";

// Context
import { useGridStateContext } from "../../context/GridState";

// Util
import { getPrettyBedLayout } from "../../utils";

const GeneralSection = ({ onSave = (f) => f }) => {
  /* Get GridData and BedLayout from context */
  const { bedLayout } = useGridStateContext();

  return (
    <Box>
      <CustomFormControlSetting
        label="Bed Layout"
        id="bedLayout"
        initialValue={getPrettyBedLayout(bedLayout)}
        onSave={onSave}
      >
        <CustomTextField id="bedLayoutTextField" fullWidth multiline />
      </CustomFormControlSetting>
    </Box>
  );
};

export default GeneralSection;
