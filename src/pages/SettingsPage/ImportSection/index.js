import { useState, useCallback } from "react";

// MUI
import { Box, Typography, Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// Custom components
import Importer from "../../../components/Importer";

// GridData context
import { useGridStateContext } from "../../../context/GridState";

const ImportSection = () => {
  /* Use this hook to updateGridData once new data is imported */
  const { updateGridData } = useGridStateContext();

  // We have uploaded a file but not "imported" the data until confirmed
  const [pendingDataImport, setPendingDataImport] = useState(null);

  // We have confirmed the import. The new data is now the gridData
  const [confirmedDataImport, setConfirmedDataImport] = useState(false);

  /* New data has been uploaded using the Importer component,
  now awaiting confirmation */
  const handleNewDataImported = useCallback((data) => {
    if (!data) return;
    setPendingDataImport(data);
    setConfirmedDataImport(false);
  }, []);

  /* Imported data has been confirmed to overwrite the existing gridData */
  const handleUpdateGridData = (data) => {
    updateGridData(data);
    setPendingDataImport(null);
    setConfirmedDataImport(true);
  };

  return (
    <Box>
      <Importer onNewDataSelected={handleNewDataImported} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          alignItems: "center",
          margin: "5px 0px",
        }}
      >
        {pendingDataImport ? (
          <div align="center">
            <Button
              sx={{
                color: "white",
                backgroundColor: "warning.main",
              }}
              variant="contained"
              size="small"
              onClick={() => handleUpdateGridData(pendingDataImport)}
              startIcon={<WarningIcon />}
            >
              Use this data?
            </Button>
            <Typography
              variant="caption"
              sx={{
                color: "warning.main",
              }}
            >
              <br />
              (This will overwrite your current grid. Consider exporting it
              first.)
            </Typography>
          </div>
        ) : (
          confirmedDataImport && (
            <Box style={{ display: "inline-flex", alignItems: "center" }}>
              <CheckBoxIcon
                sx={{
                  color: "primary.main",
                  fontSize: "1.2rem",
                  marginRight: "2px",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "primary.main",
                  fontSize: "1rem",
                }}
              >
                Successfully imported.
              </Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default ImportSection;
