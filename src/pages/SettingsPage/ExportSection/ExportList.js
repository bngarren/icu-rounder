import * as React from "react";

// MUI
import {
  Grid,
  Stack,
  Divider,
  Typography,
  ButtonUnstyled,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";

// Context
import { useGridStateContext } from "../../../context/GridState";

// Utility
import { isBedEmpty } from "../../../utils/Utility";

/* Styling */
const StyledButton = styled(ButtonUnstyled, {
  name: "StyledButton",
})(({ theme }) => ({
  border: 0,
  backgroundColor: "transparent",
  fontSize: theme.typography.formFontSizeLevel3,
  cursor: "pointer",
}));

/* This component renders the Checkbox for each bedspace */
const ExportItem = ({ value, selected, toggleSelected }) => {
  if (value != null) {
    /* Check if properties exist and are non-empty */
    const bed = typeof value.bed === "string" && value.bed.length && value.bed;
    const lastName =
      typeof value.lastName === "string" &&
      value.lastName.length &&
      value.lastName;

    const empty = isBedEmpty(value);

    const label = (
      <>
        <Typography
          variant="body2"
          component="span"
          sx={{ color: empty && "grey.600" }}
        >
          {bed}
        </Typography>
        <Typography variant="body2" component="span">
          {lastName && ` - ${lastName}`}
        </Typography>
      </>
    );

    return (
      <FormControlLabel
        sx={{ margin: 0 }}
        control={
          <Checkbox
            size="small"
            checked={selected}
            onClick={toggleSelected(value)}
            sx={{
              p: "3px",
              color: "primary.light",
              "&.Mui-checked": {
                color: "primary.light",
              },
            }}
          />
        }
        label={label}
      />
    );
  } else {
    return <></>;
  }
};

/* A component that allows choosing a portion of the gridData to
be selected for export. Each time a new selection is made, a callback
is fired on the parent (ExportSection) to let it update it's object for export. */
const ExportList = ({ onChangeSelected = (f) => f }) => {
  const { gridData } = useGridStateContext();

  const [expanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState([]);

  /* If new gridData comes in, reset the list so that all of them
  start off selected */
  React.useEffect(() => {
    setSelected([...gridData]);
  }, [gridData]);

  /* Each time a new selection is made, send this back to parent so
  that this new group can be exported */
  React.useEffect(() => {
    onChangeSelected(selected);
  }, [selected, onChangeSelected]);

  const error = selected.length < 1;

  const handleToggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const handleToggleSelection = (value) => () => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  /* The following are functions that help the user select/filter the list. 
  TODO Consider adding an Autocomplete field that allows user to choose certain filters
   */
  const handleSelectAll = () => {
    setSelected([...gridData]);
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const handleFilterNonEmpty = () => {
    const newSelected = selected.filter((el) => !isBedEmpty(el));
    setSelected(newSelected);
  };

  /* Generates the list of items. Divides list into 2 columns if 
  longer than threshold */
  const THRESHOLD = 15;
  const listOfExportItems = () => {
    /* Single column, if less than this size */
    if (gridData.length <= THRESHOLD) {
      return (
        <Stack>
          {gridData.map((value, key) => {
            return (
              <ExportItem
                key={`${value.bed}-${key}`}
                value={value}
                selected={selected.indexOf(value) !== -1}
                toggleSelected={handleToggleSelection}
              />
            );
          })}
        </Stack>
      );
    } else {
      /* Split into 2 columns */
      const halfwayIndex = Math.floor(gridData.length / 2);
      const firstHalf = gridData.slice(0, halfwayIndex);
      const secondHalf = gridData.slice(halfwayIndex, gridData.length);

      return (
        <Grid container>
          {[firstHalf, secondHalf].map((data, key) => {
            return (
              <Grid item xs={6} key={key}>
                <Stack>
                  {data.map((value, key) => {
                    return (
                      <ExportItem
                        key={`${value.bed}-${key}`}
                        value={value}
                        selected={selected.indexOf(value) !== -1}
                        toggleSelected={handleToggleSelection}
                      />
                    );
                  })}
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      );
    }
  };

  return (
    <FormControl
      error={error}
      component="fieldset"
      variant="standard"
      sx={{ width: "100%" }}
    >
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Stack direction="row" spacing={1}>
          <Typography variant="overline" sx={{ color: error && "error.main" }}>
            <b>{selected.length}</b> of {gridData.length} beds selected
          </Typography>
          <Tooltip title={expanded ? "Show less" : "Show more"}>
            <IconButton
              size="small"
              onClick={handleToggleExpanded}
              sx={{ p: "1px 3px" }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
        </Stack>

        <StyledButton onClick={handleSelectAll}>Select All</StyledButton>
        <StyledButton onClick={handleClearAll}>Clear All</StyledButton>
        <Tooltip title="Filter empty beds">
          <IconButton
            size="small"
            onClick={handleFilterNonEmpty}
            sx={{ p: "2px" }}
          >
            <FilterAltIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <FormHelperText>
        {error && "Please select at least 1 item."}
      </FormHelperText>
      <Collapse in={expanded}>{listOfExportItems()}</Collapse>
    </FormControl>
  );
};

export default ExportList;
