// Material UI
import { Grid } from "@mui/material";
// import { makeStyles } from "@mui/styles";

// Custom component
import ContingencyOptionsEditor from "../../../components/ContingencyOptionsEditor";

// Context
import { useSettings } from "../../../context/Settings";

// const useStyles = makeStyles((theme) => ({}));

const ContingenciesSection = ({ parentCss, onSave = (f) => f }) => {
  // const classes = useStyles();

  /* Get Settings context */
  const { settings } = useSettings();

  const contingencyOptions = settings.contingencyOptions || [];

  /* New contingency option added */
  const handleNewContingencyOption = (val) => {
    onSave("contingencyOptions", [...contingencyOptions, val]);
  };

  /* Removed a contingency option  */
  const handleRemoveContingenyOption = (i) => {
    let newArray = [...contingencyOptions];
    newArray.splice(i, 1);
    onSave("contingencyOptions", newArray);
  };

  return (
    <>
      <Grid item className={parentCss.sectionGridItem}>
        <ContingencyOptionsEditor
          data={contingencyOptions}
          onSubmit={handleNewContingencyOption}
          onRemove={handleRemoveContingenyOption}
        />
      </Grid>
    </>
  );
};

export default ContingenciesSection;
