// Material UI
import { Grid, Select, MenuItem } from "@mui/material";
// import { makeStyles } from "@mui/styles";

// Custom components
import CustomTextField from "../CustomTextField";
import CustomFormControlSetting from "../../../components/CustomFormControl/CustomFormControlSetting";

// Context
import { useSettings } from "../../../context/Settings";

// const useStyles = makeStyles((theme) => ({}));

const DocumentSection = ({ parentCss, onSave = (f) => f }) => {
  // const classes = useStyles();

  /* Get Settings context */
  const { settings } = useSettings();

  return (
    <>
      <Grid item className={parentCss.sectionGridItem}>
        <CustomFormControlSetting
          label="Title"
          id="document_title"
          initialValue={settings.document_title}
          onSave={onSave}
        >
          <CustomTextField id="documentTitleTextField" fullWidth />
        </CustomFormControlSetting>
      </Grid>
      <Grid item className={parentCss.sectionGridItem}>
        <CustomFormControlSetting
          label="Grids per Row"
          id="document_cols_per_page"
          initialValue={settings.document_cols_per_page}
          onSave={onSave}
        >
          <Select
            id="document_cols_per_page"
            classes={{
              root: parentCss.selectInputRoot,
              select: parentCss.selectInputSelect,
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </CustomFormControlSetting>
      </Grid>
    </>
  );
};

export default DocumentSection;
