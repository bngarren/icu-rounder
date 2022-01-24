// Material UI
import { Grid } from "@mui/material";
// import { makeStyles } from "@mui/styles";

// Custom components
import CustomTextField from "../CustomTextField";
import CustomFormControlSetting from "../../../components/CustomFormControl/CustomFormControlSetting";

// Context
import { useGridStateContext } from "../../../context/GridState";

// Util
import { getPrettyBedLayout } from "../../../utils/Utility";

// const useStyles = makeStyles((theme) => ({}));

const GeneralSection = ({ parentCss, onSave = (f) => f }) => {
  // const classes = useStyles();

  /* Get GridData and BedLayout from context */
  const { bedLayout } = useGridStateContext();

  return (
    <>
      <Grid item className={parentCss.sectionGridItem}>
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
