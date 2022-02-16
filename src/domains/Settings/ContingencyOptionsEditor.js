import { useState } from "react";

// MUI
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";

/* Styling */
const StyledGridRoot = styled(Grid, {
  name: "ContingencyOptionsEditor",
  slot: "Root",
})(() => ({
  alignItems: "center",
  justifyContent: "center",
}));

const StyledList = styled(List, {
  name: "ContingencyOptionsEditor",
  slot: "list",
})(({ theme }) => ({
  maxHeight: "75vh",
  overflowY: "auto",
  maxWidth: "300px",
  padding: "12px 0px",
  "& .MuiListItem-container": {
    padding: "2px 0px 2px 5px",
    marginBottom: 1,
    width: "100%",
    "&:hover .MuiListItem-root": {
      background: theme.palette.grey[100],
    },
    "& .MuiListItemSecondaryAction-root": {
      visibility: "hidden",
    },
    "&:hover .MuiListItemSecondaryAction-root": {
      visibility: "inherit",
    },
  },
}));

const StyledListItem = styled(ListItem, {
  name: "ContingencyOptionsEditor",
  slot: "listItem",
})(() => ({
  padding: "4px",
}));

const ContingencyOptionsEditor = ({
  data,
  onSubmit = (f) => f,
  onRemove = (f) => f,
}) => {
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
    <StyledGridRoot container>
      <Grid item xs={12} md={6}>
        <TextField
          placeholder={"Add new..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          inputProps={{
            sx: {
              p: 1,
            },
          }}
        />
      </Grid>
      <Grid item xs md>
        <StyledList>
          {sortedData != null &&
            sortedData.length > 0 &&
            sortedData.map((value, index) => {
              return (
                <StyledListItem key={`${value}-${index}`}>
                  <ListItemText
                    primary={value}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "formFontSizeLevel2",
                        margin: 0,
                      },
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      sx={{
                        fontSize: "1rem",
                        padding: "2px",
                      }}
                      onClick={() => onRemove(index)}
                      size="large"
                    >
                      <ClearIcon
                        sx={{
                          color: "primary.light",
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </StyledListItem>
              );
            })}
        </StyledList>
      </Grid>
    </StyledGridRoot>
  );
};

export default ContingencyOptionsEditor;
