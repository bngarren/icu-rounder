// MUI
import { Stack, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

/* Styling */
const StyledSectionStack = styled(Stack, {
  name: "SettingsPageSection",
  slot: "Root",
})(() => ({
  marginBottom: "0.5rem",
}));

const StyledSectionBox = styled(Box, {
  name: "SettingsPageSection",
  slot: "section",
})(() => ({
  paddingLeft: "8px",
  paddingRight: "8px",
}));

const SettingsPageSection = ({ title, subtitle, section }) => {
  return (
    <StyledSectionStack direction="column" spacing={1}>
      <Typography
        variant="h5"
        sx={{
          backgroundColor: "primary.dark",
          color: "primary.contrastText",
          boxShadow: 25, // custom shadow in Theme
          py: 0.3,
          px: 1,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderBottomRightRadius: 2,
          borderBottomLeftRadius: 2,
        }}
      >
        {title}
      </Typography>

      {subtitle != null ? (
        <Typography variant="subtitle" sx={{ pl: "2px", pb: "8px" }}>
          {subtitle}
        </Typography>
      ) : (
        ""
      )}
      <StyledSectionBox>{section && section}</StyledSectionBox>
    </StyledSectionStack>
  );
};

export default SettingsPageSection;
