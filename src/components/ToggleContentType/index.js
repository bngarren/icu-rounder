import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import NotesIcon from "@material-ui/icons/Notes";
import VerticalSplitIcon from "@material-ui/icons/VerticalSplit";

const ToggleContentType = ({ value, onChange = (f) => f }) => {
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
      style={{ backgroundColor: "white", margin: "8px 0px 0px 2px" }}
    >
      <ToggleButton value="simple" aria-label="simple input" size="small">
        <NotesIcon style={{ fontSize: "12pt" }} />
      </ToggleButton>
      <ToggleButton value="nested" aria-label="nested input" size="small">
        <VerticalSplitIcon style={{ fontSize: "12pt" }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleContentType;
