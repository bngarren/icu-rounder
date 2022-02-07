//MUI
import { Container, Box, Grid, Typography, Divider } from "@mui/material";
import { styled } from "@mui/system";

// custom components
import SettingsPageSection from "./SettingsPageSection";
import GeneralSection from "./GeneralSection";
import DocumentSection from "./DocumentSection";
import ExportSection from "./ExportSection";
import ImportSection from "./ImportSection";
import ContingenciesSection from "./ContingenciesSection";
import { useDialog } from "../../components/Dialog";

// Context
import { useSettings } from "../../context/Settings";
import { useGridStateContext } from "../../context/GridState";

// Utility
import { isBedEmpty, getDataForBed } from "../../utils/Utility";

/* Styling */
const StyledBodyBox = styled(Box, {
  name: "SettingsPage",
  slot: "body",
})(() => ({
  display: "flex",
  flexDirection: "column",
}));

const SettingsPage = () => {
  /* Get Settings context */
  const { dispatchSettings } = useSettings();

  /* Get GridData and BedLayout from context */
  const { bedLayout, gridData, updateGridData } = useGridStateContext();

  /* Hook for our Dialog modal */
  const { dialogIsOpen, dialog, showYesNoDialog } = useDialog();

  /* 
  **
  Handles the saving of the Settings data by passing
  new data to SettingsContext via dispatchSettings, or 
  updating bedLayout variable of GridStateContext
  **
  */
  const handleOnSave = (id, value) => {
    if (id == null || value == null) {
      throw new Error(
        "Couldn't complete handleOnSave. Either the id or value is null/undefined"
      );
    }

    if (id === "bedLayout") {
      handleSaveBedLayout(value);
    } else {
      try {
        dispatchSettings({
          type: "UPDATE",
          payload: {
            [id]: value,
          },
        });
      } catch (error) {
        console.error(`Could not save [${id}].`);
      }
    }
  };

  /* 
  **
  Handles the saving of the bedLayout in GridStateContext. 
  Importantly, this function checks new vs old bedlayout to alert user
  if patient data might be overwritten.
  **
 */
  /**
   *
   * @param {string} newBedLayout The "new" bedLayout string from user input
   */
  const handleSaveBedLayout = (newBedLayout) => {
    /* Convert the inputted bedLayout string (CSV format) to an array */
    const formattedBedLayout = getBedLayoutArrayFromCsv(newBedLayout);

    /* Find the beds that differ between the current and new bedLayouts */
    let difference = bedLayout.filter((x) => !formattedBedLayout.includes(x));
    /* Of these beds, if any, find which ones have patient data at risk of being deleted */
    let riskBeds = [];
    if (difference.length > 0) {
      difference.forEach((i) => {
        // Uses Utility function to get the bed's data and see if it's empty
        if (!isBedEmpty(getDataForBed(gridData, i))) {
          riskBeds.push(i);
        }
      });
    }
    // If there are bed(s) with data that are missing from new bedLayout
    if (riskBeds.length > 0) {
      // Construct the message for the Dialog
      const content = (
        <div>
          <p>
            This new bed layout will <b>NOT</b> include the following beds which
            are non-empty:
          </p>
          <p>
            {riskBeds.map((i) => {
              return `| ${i} |     `;
            })}
          </p>
        </div>
      );
      showYesNoDialog(
        content,
        () => {
          // chose to continue
          updateGridData(gridData, formattedBedLayout);
        },
        () => {
          // chose to cancel
          return;
        },
        { yes: "Continue", no: "Cancel" }
      );
    } else {
      updateGridData(gridData, formattedBedLayout);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h4" sx={{ marginBottom: "15px" }}>
          Settings
        </Typography>
      </Box>

      <StyledBodyBox>
        {/* - - - - - section GENERAL - - - - - */}
        <SettingsPageSection
          title="General"
          section={<GeneralSection onSave={handleOnSave} />}
        />
        <Divider />
        {/* - - - - - section DOCUMENT - - - - - */}
        <SettingsPageSection
          title="Document"
          section={<DocumentSection onSave={handleOnSave} />}
        />
        <Divider />
        {/* - - - - - section EXPORT - - - - - */}
        <SettingsPageSection
          title="Export"
          subtitle="Download the current grid as a .json file."
          section={<ExportSection onSave={handleOnSave} />}
        />
        <Divider />
        {/* - - - - - section IMPORT - - - - - */}
        <SettingsPageSection
          title="Import"
          subtitle="Upload a previously saved .json file to populate the grid."
          section={<ImportSection />}
        />
        <Divider />
        {/* - - - - - section CONTINGENCIES - - - - - */}
        <SettingsPageSection
          title="Contingencies"
          subtitle="Save your custom contingencies for later use."
          section={<ContingenciesSection onSave={handleOnSave} />}
        />
      </StyledBodyBox>
      {dialogIsOpen && dialog}
    </Container>
  );
};

/* Helper function for taking the input bedLayout (CSV format) and 
  converting it to a valid array */
const getBedLayoutArrayFromCsv = (csv) => {
  let res = [];
  if (csv == null || csv === "") return res;
  let arr = csv.split(",");
  arr.forEach((element) => {
    if (element === "") return;
    res.push(element.trim());
  });
  return res;
};

export default SettingsPage;
