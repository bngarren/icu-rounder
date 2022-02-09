import * as React from "react";

// MUI
import { Grid, Stack, Box, Typography, Checkbox } from "@mui/material";

// Context
import { useGridStateContext } from "../../../context/GridState";

const ExportItem = ({ value, selected, toggleSelected }) => {
  if (value != null) {
    /* Check if properties exist and are non-empty */
    const bed = typeof value.bed === "string" && value.bed.length && value.bed;
    const lastName =
      typeof value.lastName === "string" &&
      value.lastName.length &&
      value.lastName;

    return (
      <Box>
        <Checkbox
          size="small"
          checked={selected}
          onClick={toggleSelected(value)}
        />
        {bed} {lastName && `- ${lastName}`}
      </Box>
    );
  } else {
    return <></>;
  }
};

const ExportList = () => {
  const { gridData } = useGridStateContext();

  const [selected, setSelected] = React.useState([]);

  React.useEffect(() => {
    setSelected([...gridData]);
  }, [gridData]);

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
      <Typography variant="caption">
        {selected.length} of {gridData.length} selected.
      </Typography>
      {listOfExportItems()}
    </Box>
  );
};

export default ExportList;
