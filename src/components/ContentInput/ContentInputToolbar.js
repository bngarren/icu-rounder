import { useState } from "react";

// MUI
import { AppBar, Toolbar, Divider, MenuItem, TextField } from "@mui/material";
import { styled } from "@mui/system";

import { makeStyles } from "@mui/styles";

import QuickAddInput from "./QuickAddInput";

/* Styling */
const StyledAppBar = styled(AppBar, {
  name: "ContentInputToolbar",
  slot: "appbar",
})(() => ({
  backgroundColor: "transparent",
  flexShrink: "inherit",
  zIndex: "100",
}));

const StyledToolBar = styled(Toolbar, {
  name: "ContentInputToolbar",
  slot: "toolbar",
})(() => ({
  minHeight: "auto",
  padding: "2px 6px",
}));

const dividerSx = {
  margin: "0 6px",
};

const ContentInputToolbar = ({
  contentType,
  onAddSection = (f) => f,
  onSelectTemplate = (f) => f,
}) => {
  return (
    <StyledAppBar position="static" square={true} elevation={0}>
      <StyledToolBar disableGutters variant="dense" sx={{}}>
        {contentType === "nestedContent" && (
          <>
            <Divider orientation="vertical" flexItem sx={{ ...dividerSx }} />
            <QuickAddInput label="Add Section" onSubmit={onAddSection} />
            <Divider orientation="vertical" flexItem sx={{ ...dividerSx }} />
            <SelectTemplate onSelect={onSelectTemplate} />
          </>
        )}
      </StyledToolBar>
    </StyledAppBar>
  );
};

const useStylesForSelectTemplate = makeStyles((theme) => ({
  select: {
    minWidth: "100px",
    background: "white",
    color: "#676767",
    borderBottom: "1px dotted transparent",
    borderRadius: "0px",
    "&:hover": {
      color: "black",
    },
    "&:focus": {
      background: "white",
      borderStyle: "solid",
      borderTop: 0,
      borderRight: 0,
      borderBottomWidth: 1,
      borderLeft: 0,
      borderColor: theme.palette.secondary.main,
    },
  },
  menuPaper: {
    maxWidth: "200px",
  },
  menuList: {
    paddingTop: 0,
    paddingBottom: 0,
    background: "#f6f8fa",
    "& li.Mui-selected": {
      fontWeight: 700,
    },
  },
  menuItemPlaceholder: {
    fontSize: "10pt",
  },
  menuItem: {
    fontSize: "10pt",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
}));

/* Styling */

const selectSx = {
  background: "white",
  color: "#676767",
  borderBottom: "1px dotted transparent",
  borderRadius: "0px",
  "&:hover": {
    color: "black",
  },
  "&:focus": {
    background: "white",
    borderStyle: "solid",
    borderTop: 0,
    borderRight: 0,
    borderBottomWidth: 1,
    borderLeft: 0,
    borderColor: "primary.main",
  },
};

const SelectTemplate = ({ onSelect = (f) => f }) => {
  const classes = useStylesForSelectTemplate();

  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    console.log(val);

    if (val && val !== "" && val?.length > 0) {
      onSelect(val);
      setValue("");
    } else {
      setValue(val);
    }
  };

  return (
    <TextField
      value={value}
      onChange={handleChange}
      select
      id="selectTemplate"
      label="Template"
      overflow="hidden"
      SelectProps={{
        sx: selectSx,
        displayEmpty: true,
        MenuProps: {
          classes: {
            list: classes.menuList,
          },
          PaperProps: {
            className: classes.menuPaper,
            elevation: 2,
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        },
      }}
    >
      <MenuItem value="" className={classes.menuItemPlaceholder}>
        Select...
      </MenuItem>

      {OPTIONS.map((option) => {
        return (
          <MenuItem
            key={option.id}
            value={option.value}
            className={classes.menuItem}
          >
            {option.name}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

const OPTIONS = [
  {
    id: 1,
    name: "Systems long",
    value: ["NEURO", "RESP", "CV", "FEN", "ID", "HEME", "ENDO", "ACCESS"],
  },
  {
    id: 2,
    name: "Systems brief",
    value: ["N", "R", "CV", "F", "ID", "H", "E", "ACC"],
  },
  {
    id: 3,
    name: "Active/TODO",
    value: ["Active Issues", "TODO"],
  },
];

export default ContentInputToolbar;
