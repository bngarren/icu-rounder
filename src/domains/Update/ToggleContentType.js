import * as React from "react";

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

/**
 * Renders the toggle button for switching the contentType.
 * Receives a 'field' prop from the Controller that wraps it (from
 * react-hook-form).
 */
const ToggleContentType = ({ field }) => {
  return (
    <ToggleButtonGroup
      ref={field.ref}
      exclusive
      aria-label="content type"
      value={field.value}
      onChange={(_, data) => field.onChange(data)}
      sx={{ backgroundColor: "white" }}
    >
      <StyledToggleButton
        value="simple"
        aria-label="simple input"
        size="small"
        title="Simple"
        disabled={field.value === "simple"}
      >
        <NotesIcon sx={{ fontSize: iconSize }} />
      </StyledToggleButton>
      <StyledToggleButton
        value="nested"
        aria-label="advanced input"
        size="small"
        title="Advanced"
        disabled={field.value === "nested"}
      >
        <VerticalSplitIcon sx={{ fontSize: iconSize }} />
      </StyledToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleContentType;
