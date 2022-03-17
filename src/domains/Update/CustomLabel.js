// MUI
import { Box } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const CustomLabel = ({ label, isDirty }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {isDirty && (
        <CircleIcon
          sx={{
            fontSize: "0.8rem",
            color: "secondary.dark",
            pr: "2px",
          }}
        />
      )}

      {label}
    </Box>
  );
};

export default CustomLabel;
