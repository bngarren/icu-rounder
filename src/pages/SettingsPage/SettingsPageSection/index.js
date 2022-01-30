import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  sectionTitle: {
    marginTop: "5px",
    marginBottom: "10px",
  },
}));

const SettingsPageSection = ({ title, subtitle, children }) => {
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.sectionTitle} variant="h6">
        {title}
      </Typography>
      {subtitle != null ? (
        <Typography variant="body2">{subtitle}</Typography>
      ) : (
        ""
      )}
      <br />
      {children}
    </>
  );
};

export default SettingsPageSection;
