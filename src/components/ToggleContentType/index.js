import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import NotesIcon from "@mui/icons-material/Notes";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";

// MUI
import { styled } from "@mui/system";

/* Styling */
const StyledToggleButton = styled(ToggleButton, {
  name: "StyledToggleButton",
})(({ theme }) => ({
  padding: theme.spacing(0.5),
  color: theme.palette.primary.light,
  "&:hover": {
    color: theme.palette.primary.dark,
  },
  "&.Mui-selected": {
    color: theme.palette.primary.dark,
  },
}));

const iconSize = "1.3rem";

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
      sx={{ backgroundColor: "white" }}
    >
      <StyledToggleButton
        value="simple"
        aria-label="simple input"
        size="small"
        title="Simple"
        disabled={value === "simple"}
      >
        <NotesIcon sx={{ fontSize: iconSize }} />
      </StyledToggleButton>
      <StyledToggleButton
        value="nested"
        aria-label="nested input"
        size="small"
        title="Advanced"
        disabled={value === "nested"}
      >
        <VerticalSplitIcon sx={{ fontSize: iconSize }} />
      </StyledToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleContentType;
