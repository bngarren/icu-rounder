import { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  InputBase,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: "200px",
    overflowY: "auto",
    maxWidth: "300px",
  },
  listItem: {
    padding: "2px 0px",
    marginBottom: 1,
    width: "max-content",
  },
  listItemText: {
    fontSize: "10pt",
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
    <div>
      <InputBase
        placeholder={"Add new..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
      />
      <List className={classes.list}>
        {sortedData != null &&
          sortedData.length > 0 &&
          sortedData.map((value, index) => {
            return (
              <ListItem className={classes.listItem} key={`${value}-${index}`}>
                <ListItemText
                  primaryTypographyProps={{
                    classes: {
                      root: classes.listItemText,
                    },
                  }}
                >
                  {value}
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    className={classes.clearIconButton}
                    onClick={() => onRemove(index)}
                  >
                    <ClearIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

export default ContingencyOptionsEditor;
