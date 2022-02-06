// MUI
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

/* Styling */
const StyledSectionBox = styled(Box, {
  name: "SettingsPageSection",
  slot: "Root",
})(() => ({
  marginBottom: "0.5rem",
}));

const SettingsPageSection = ({ title, subtitle, section }) => {
  return (
    <StyledSectionBox>
      <Typography variant="h5" sx={{ marginTop: "5px", marginBottom: "10px" }}>
        {title}
      </Typography>
      {subtitle != null ? (
        <Typography variant="body2">{subtitle}</Typography>
      ) : (
        ""
      )}
      {section && section}
    </StyledSectionBox>
  );
};

export default SettingsPageSection;
