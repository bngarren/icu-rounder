import { useState, useEffect, useCallback } from "react";
import { useSettings } from "../../context/Settings";

import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import {
  Container,
  Grid,
  IconButton,
  Tooltip,
  Zoom,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    marginBottom: 10,
  },
  saveButton: {
    color: "#b7d100",
    transform: "translateY(-5px)",
  },
  inputsGridContainer: {
    flexDirection: "column",
  },
  inputsGridItem: {
    marginBottom: "10px",
  },
  inputLabel: {
    width: "max-content",
    fontSize: "13pt",
  },
});

const SettingsPage = () => {
  const classes = useStyles();
  const { settings, dispatchSettings } = useSettings();
  const [needsSave, setNeedsSave] = useState(false);

  const [inputValues, setInputValues] = useState();

  const updateInputValuesFromSettings = useCallback((stgs) => {
    setInputValues({
      document_cols_per_page: stgs.document_cols_per_page,
      document_title: stgs.document_title,
    });
  }, []);

  useEffect(() => {
    updateInputValuesFromSettings(settings);
  }, [settings, updateInputValuesFromSettings]);

  const handleOnChange = (target, value) => {
    setInputValues((prevState) => {
      return { ...prevState, [target]: value };
    });
    setNeedsSave(true);
  };

  const handleOnSave = (e) => {
    e.preventDefault();
    dispatchSettings({
      type: "UPDATE",
      payload: {
        // TODO Can we just map through the inputValues here?
        document_cols_per_page: inputValues.document_cols_per_page,
        document_title: inputValues.document_title,
      },
    });
    setNeedsSave(false);
  };

  if (inputValues) {
    return (
      <Container maxWidth="sm">
        <Grid container className={classes.header}>
          <Typography className={classes.title} variant="h4">
            Settings
          </Typography>
          <Zoom
            in={needsSave}
            timeout={{
              enter: 250,
              exit: 100,
            }}
            unmountOnExit
          >
            <IconButton className={classes.saveButton} onClick={handleOnSave}>
              <Tooltip title="Confirm settings" enterDelay={25}>
                <SaveIcon style={{ fontSize: "25pt" }} />
              </Tooltip>
            </IconButton>
          </Zoom>
        </Grid>

        <Grid container className={classes.inputsGridContainer}>
          <Grid item className={classes.inputsGridItem}>
            <TextField
              label="Document Title"
              value={inputValues.document_title}
              onChange={(e) => handleOnChange("document_title", e.target.value)}
            />
          </Grid>
          <Grid item className={classes.inputsGridItem}>
            <FormControl>
              <InputLabel
                className={classes.inputLabel}
                shrink
                id="document_cols_per_page_label"
              >
                Grids per row
              </InputLabel>
              <Select
                labelId="document_cols_per_page_label"
                id="document_cols_per_page"
                value={inputValues.document_cols_per_page}
                onChange={(e) =>
                  handleOnChange("document_cols_per_page", e.target.value)
                }
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    );
  } else {
    return <></>;
  }
};

export default SettingsPage;
