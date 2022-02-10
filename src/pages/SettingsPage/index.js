//MUI
import { Container, Stack, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

// custom components
import SettingsPageSection from "./SettingsPageSection";
import GeneralSection from "./GeneralSection";
import DocumentSection from "./DocumentSection";
import ExportSection from "./ExportSection";
import ImportSection from "./ImportSection";
import ContingenciesSection from "./ContingenciesSection";
import SecuritySection from "./SecuritySection";
import { useDialog } from "../../components/Dialog";

// Context
import { useSettings } from "../../context/Settings";
import { useGridStateContext } from "../../context/GridState";

// Utility
import { isBedEmpty, getDataForBed } from "../../utils/Utility";

/* Styling */
const StyledBodyStack = styled(Stack, {
  name: "SettingsPage",
  slot: "body",
})(() => ({}));

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
  /**
   * @return {bool} Returns true if save action was successful, false if not */
  const handleOnSave = (id, value) => {
    if (id == null || value == null) {
      throw new Error(
        "Couldn't complete handleOnSave. Either the id or value is null/undefined"
      );
    }

    let success = false;

    if (id === "bedLayout") {
      success = handleSaveBedLayout(value);
    } else {
      try {
        dispatchSettings({
          type: "UPDATE",
          payload: {
            [id]: value,
          },
        });
        success = true;
      } catch (error) {
        console.error(`Could not save [${id}].`);
      }
    }
    return success;
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
   * @return {bool} Returns true if save was successful, false if not
   */
  const handleSaveBedLayout = (newBedLayout) => {
    /* Convert the input bedLayout string (CSV format) to an array */
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
          return true;
        },
        () => {
          // chose to cancel
          return false;
        },
        { yes: "Continue", no: "Cancel" }
      );
    } else {
      updateGridData(gridData, formattedBedLayout);
      return true;
    }
  };

  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h4" sx={{ marginBottom: "15px" }}>
          Settings
        </Typography>
      </Box>

      <StyledBodyStack direction="column" spacing={4}>
        {/* - - - - - section GENERAL - - - - - */}
        <SettingsPageSection
          title="General"
          section={<GeneralSection onSave={handleOnSave} />}
        />

        {/* - - - - - section DOCUMENT - - - - - */}
        <SettingsPageSection
          title="Document"
          subtitle="Adjust the appearance of the downloadable PDF."
          section={<DocumentSection onSave={handleOnSave} />}
        />

        {/* - - - - - section EXPORT - - - - - */}
        <SettingsPageSection
          title="Export"
          subtitle="Download the current grid as a .json file."
          section={<ExportSection onSave={handleOnSave} />}
        />

        {/* - - - - - section IMPORT - - - - - */}
        <SettingsPageSection
          title="Import"
          subtitle="Upload a previously saved .json file to populate the grid."
          section={<ImportSection />}
        />

        {/* - - - - - section CONTINGENCIES - - - - - */}
        <SettingsPageSection
          title="Contingencies"
          subtitle="Save your custom contingencies for later use."
          section={<ContingenciesSection onSave={handleOnSave} />}
        />

        {/* - - - - - section SECURITY - - - - - */}
        <SettingsPageSection
          title="Security & Privacy"
          subtitle="Manage your browser data."
          section={<SecuritySection showYesNoDialog={showYesNoDialog} />}
        />
      </StyledBodyStack>
      {dialogIsOpen && dialog}
    </Container>
  );
};

/* Helper function for taking the input bedLayout (CSV format) and 
  converting it to a valid array. This is NOT where
  validation happens. It does take accepted characters, i.e, commas,
  and converts them to an appropriate format. */
/**
 * @param {string} csv String containing comma-separated values
 * @return {array} Array containing bedLayout, e.g. ["1", "2", "3"]
 */
const getBedLayoutArrayFromCsv = (csv) => {
  let res = [];
  if (csv == null || csv === "") return res;

  /* This regex looks for zero or more spaces, followed by a comma,
  followed by zero or more spaces—and, when found, removes the spaces
  and the comma from the string */
  const remove = /\s*(?:,|$)\s*/;
  let arr = csv.split(remove);
  arr.forEach((element) => {
    if (element === "") return;
    res.push(element.trim());
  });

  return res;
};

export default SettingsPage;
