// MUI
import { Box } from "@mui/material";

// Custom components
import { ButtonStandard, useDialog } from "../../components";

const SecuritySection = () => {
  const { confirm } = useDialog();

  const handleClearStorage = async () => {
    let proceed = false;

    // Show a confirm dialog before clearing storage
    const dialogTemplate = {
      title: "Remove browser (local) storage?",
      content: `This will clear all data within the app. Make sure you have exported your data.`,
    };
    const res = await confirm(dialogTemplate);
    proceed = res;

    if (proceed) {
      // confirmed
      localStorage.clear();
      window.location.reload(false);
    }
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
