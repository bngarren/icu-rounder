import { useState } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  InputBase,
} from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import ClearIcon from "@mui/icons-material/Clear";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderBottom: "3px solid #dcdcdc40",
  },
  list: {
    maxHeight: "200px",
    overflowY: "auto",
    maxWidth: "300px",
    padding: "12px 0px",
  },
  listItemContainer: {
    "&:hover": {
      borderLeft: "5px solid #dcdcdc40",
    },
    "&:hover $listItemSecondaryAction": {
      visibility: "inherit",
    },
  },
  listItem: {
    padding: "2px 0px 2px 5px",
    marginBottom: 1,
    width: "max-content",
  },
  listItemText: {
    fontSize: "10pt",
    margin: 0,
  },
  listItemSecondaryAction: {
    visibility: "hidden",
  },
  clearIconButton: {
    fontSize: "9pt",
    padding: "2px",
  },
}));

const ContingencyOptionsEditor = ({
  data,
  onSubmit = (f) => f,
  onRemove = (f) => f,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [inputValue, setInputValue] = useState("");

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmit(inputValue);
      setInputValue("");
    }
  };

  const sortedData = data.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} md={6}>
        <InputBase
          className={classes.input}
          placeholder={"Add new..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </Grid>
      <Grid item xs md>
        <List className={classes.list}>
          {sortedData != null &&
            sortedData.length > 0 &&
            sortedData.map((value, index) => {
              return (
                <ListItem
                  classes={{
                    container: classes.listItemContainer,
                    root: classes.listItem,
                  }}
                  key={`${value}-${index}`}
                >
                  <ListItemText
                    primary={value}
                    primaryTypographyProps={{
                      classes: {
                        root: classes.listItemText,
                      },
                    }}
                  />
                  <ListItemSecondaryAction
                    className={classes.listItemSecondaryAction}
                  >
                    <IconButton
                      className={classes.clearIconButton}
                      onClick={() => onRemove(index)}
                      size="large">
                      <ClearIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
        </List>
      </Grid>
    </Grid>
  );
};

export default ContingencyOptionsEditor;
