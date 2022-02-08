import { useState, useEffect, cloneElement } from "react";

// MUI
import { Grid, Typography, Zoom, Button } from "@mui/material";
import { styled } from "@mui/system";

/* Styling */

const StyledGridRoot = styled(Grid, {
  name: "CustomFormControlSetting",
  slot: "Root",
  shouldForwardProp: (prop) => prop !== "diff",
})(({ theme, diff }) => ({
  display: "flex",
  flexDirection: "column",
  paddingLeft: "1rem",
  paddingBottom: "1rem",
  "&:hover": {
    // backgroundColor: theme.palette.grey[100],
  },
  // "diff" refers to having new/different, unsaved data
  ...(diff === true && {
    borderLeft: `4px solid ${theme.palette.secondary.dark}`,
    paddingLeft: "6px",
  }),
}));

const CustomFormControlSetting = ({
  label,
  initialValue,
  id,
  onSave = (f) => f,
  children,
}) => {
  const [value, setValue] = useState("");
  const [diff, setDiff] = useState(false);

  const childElement = cloneElement(children, {
    value: value,
    onChange: (e) => handleOnChange(e.target.value),
  });

  /* Each time a default value comes through as a prop,
  reset this component's value to that, and set diff to false */
  useEffect(() => {
    setValue(initialValue);
    setDiff(false);
  }, [initialValue]);

  const handleOnChange = (val) => {
    if (val === initialValue) {
      setDiff(false);
    } else {
      setDiff(true);
    }
    setValue(val);
  };

  const handleOnClickRevert = () => {
    setDiff(false);
    setValue(initialValue);
  };

  const handleOnSave = () => {
    if (id !== null) {
      let success = onSave(id, value);

      /* If a save goes through, reset to original state. Sometimes a save will
      go successfully but the data isn't different, so we need to reset it here
      manually. */
      if (success) {
        setDiff(false);
        setValue(initialValue);
      }
    }
  };

  return (
    <StyledGridRoot container diff={diff}>
      <Grid item xs={12} container wrap="nowrap" alignItems="center">
        <Grid item>
          <Typography
            sx={{ fontSize: "1rem", fontWeight: "bold" }}
            variant="caption"
          >
            {label}
          </Typography>
        </Grid>

        <Grid item xs>
          <Zoom in={diff} timeout={300}>
            <Grid container>
              <Button
                sx={{
                  marginLeft: "5px",
                  fontSize: "formFontSizeLevel3",
                  padding: "0px 4px",
                  minWidth: "40px",
                  color: "primary.light",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
                onClick={handleOnClickRevert}
              >
                Revert
              </Button>
              <Button
                onClick={handleOnSave}
                sx={{
                  marginLeft: "5px",
                  fontSize: "formFontSizeLevel3",
                  padding: "0px 4px",
                  minWidth: "40px",
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  color: "secondary.dark",
                  fontWeight: "bold",
                }}
              >
                Save
              </Button>
            </Grid>
          </Zoom>
        </Grid>
      </Grid>
      <Grid item xs>
        {childElement}
      </Grid>
    </StyledGridRoot>
  );
};

export default CustomFormControlSetting;
