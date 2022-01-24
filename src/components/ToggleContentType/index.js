import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import NotesIcon from "@mui/icons-material/Notes";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";

import { makeStyles } from "@mui/styles";

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
