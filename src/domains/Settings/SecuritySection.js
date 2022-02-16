// MUI
import { Box } from "@mui/material";

// Custom components
import { ButtonStandard } from "../../components";

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
      <ButtonStandard component="span" onClick={handleClearStorage}>
        Clear local storage
      </ButtonStandard>
      <i>(Will refresh the page)</i>
    </Box>
  );
};

export default SecuritySection;
