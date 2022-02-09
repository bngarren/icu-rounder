// MUI
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/system";

/* Styling */
const StyledSectionStack = styled(Stack, {
  name: "SettingsPageSection",
  slot: "Root",
})(() => ({
  marginBottom: "0.5rem",
}));

const SettingsPageSection = ({ title, subtitle, section }) => {
  return (
    <StyledSectionStack direction="column" spacing={1}>
      <Typography variant="h5" sx={{ marginTop: "5px" }}>
        {title}
      </Typography>
      {subtitle != null ? (
        <Typography variant="body2">{subtitle}</Typography>
      ) : (
        ""
      )}
      {section && section}
    </StyledSectionStack>
  );
};

export default SettingsPageSection;
