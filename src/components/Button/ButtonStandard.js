import Button from "@mui/material/Button";
import { styled } from "@mui/system";

/* Styling */
const StyledButton = styled(Button, {
  name: "ButtonStandard",
  slot: "root",
  shouldForwardProp: (prop) => prop !== "secondary",
})(({ theme, secondary }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.light,

  // secondary
  ...(secondary && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,

    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  }),
}));

/**
 *
 * @param {bool} secondary If true, button will have a "secondary" style which is less prominent
 * @returns A custom styled MUI Button
 */
export default function ButtonStandard({
  children,
  secondary = false,
  ...props
}) {
  return (
    <StyledButton
      variant="contained"
      size="small"
      disableElevation={secondary}
      secondary={secondary}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
