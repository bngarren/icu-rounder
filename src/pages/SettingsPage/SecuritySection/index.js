// MUI
import { Box, Button } from "@mui/material";

const SecuritySection = ({ showYesNoDialog = (f) => f }) => {
  const handleClearStorage = () => {
    const content = "Delete local data?";

    showYesNoDialog(
      content,
      () => {
        // confirmed
        localStorage.clear();
        window.location.reload(false);
      },
      () => {
        // chose to cancel
        return;
      },
      { yes: "Continue", no: "Cancel" }
    );
  };

  return (
    <Box>
      <Button
        variant="contained"
        component="span"
        size="small"
        onClick={handleClearStorage}
      >
        Clear local storage
      </Button>
      <i>(Will refresh the page)</i>
    </Box>
  );
};

export default SecuritySection;
