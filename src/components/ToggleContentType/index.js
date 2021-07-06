import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import NotesIcon from "@material-ui/icons/Notes";
import VerticalSplitIcon from "@material-ui/icons/VerticalSplit";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: "4px",
  },
}));

const ToggleContentType = ({ value, onChange = (f) => f }) => {
  const classes = useStyles();
  /* modify the onChange before sending the rest of the handling to the callback.
  This lets us always keep a value in the toggle
  */
  const handleOnChange = (event, value) => {
    if (value !== null) {
      onChange(event, value);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      aria-label="content type"
      value={value}
      onChange={handleOnChange}
      style={{ backgroundColor: "white" }}
    >
      <ToggleButton
        value="simple"
        aria-label="simple input"
        size="small"
        className={classes.button}
        title="Simple"
      >
        <NotesIcon style={{ fontSize: "12pt" }} />
      </ToggleButton>
      <ToggleButton
        value="nested"
        aria-label="nested input"
        size="small"
        className={classes.button}
        title="Advanced"
      >
        <VerticalSplitIcon style={{ fontSize: "12pt" }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleContentType;
