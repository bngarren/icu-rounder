import {
   Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
   sectionTitle: {
      marginTop: "5px",
      marginBottom: "10px",
   },
}))

const SettingsPageSection = ({ title, subtitle, children }) => {
   const classes = useStyles();

   return (
      <>
         <Typography className={classes.sectionTitle} variant="h6">
            {title}
         </Typography>
         {subtitle != null ?
            <Typography variant="body2">
               {subtitle}
            </Typography>
            : ""}
         <br />
         {children}
      </>
   )
}

export default SettingsPageSection
