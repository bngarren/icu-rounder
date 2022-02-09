import * as React from "react";

// MUI
import {
  Grid,
  Stack,
  Box,
  Divider,
  Typography,
  ButtonUnstyled,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
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
        control={
          <Checkbox
            size="small"
            checked={selected}
            onClick={toggleSelected(value)}
            sx={{
              p: "3px",
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

const ExportList = ({ onChangeSelected = (f) => f }) => {
  const { gridData } = useGridStateContext();

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

  const handleToggle = (value) => () => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

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

  const listOfExportItems = () => {
    /* Single column, if less than this size */
    if (gridData.length <= 15) {
      return (
        <Stack>
          {gridData.map((value, key) => {
            return (
              <ExportItem
                key={`${value.bed}-${key}`}
                value={value}
                selected={selected.indexOf(value) !== -1}
                toggleSelected={handleToggle}
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
                        toggleSelected={handleToggle}
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
    <Box>
      <Stack
        direction="row"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Typography variant="overline">
          <b>{selected.length}</b> of {gridData.length} selected
        </Typography>

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
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ width: "100%" }}
      >
        <FormHelperText></FormHelperText>
        {listOfExportItems()}
      </FormControl>
    </Box>
  );
};

export default ExportList;
