// MUI
import { ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import { styled } from "@mui/system";

/* // Unfortunately, wrapping with Tooltip breaks ToggleButton functionality.
https://github.com/mui-org/material-ui/issues/12921
This is a workaround. */
const TooltipToggleButton = ({ children, title, ...props }) => (
  <Tooltip title={title}>
    <span>
      <ToggleButton {...props}>{children}</ToggleButton>
    </span>
  </Tooltip>
);

/* Styling */
const StyledToggleButton = styled(TooltipToggleButton, {
  name: "StyledToggleButton",
})(({ theme }) => ({
  padding: theme.spacing(0.25),
  border: "none",
  color: theme.palette.primary.light,
  "&:hover": {
    color: theme.palette.primary.dark,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: "none",
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
