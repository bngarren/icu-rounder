// MUI
import { Box, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

const CustomLabel = ({ label, isDirty }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "primary.light",
          fontSize: "0.8rem",
          fontWeight: "bold",
        }}
      >
        {label}
      </Typography>

      {isDirty && (
        <CircleIcon
          sx={{
            fontSize: "0.8rem",
            color: "secondary.dark",
            pl: "2px",
          }}
        />
      )}
    </Box>
  );
};

export default CustomLabel;
