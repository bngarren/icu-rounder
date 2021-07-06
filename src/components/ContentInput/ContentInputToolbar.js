import { useState } from "react";
import { AppBar, Toolbar, Divider, MenuItem } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";

import CustomTextField from "./CustomTextField";
import QuickAddInput from "./QuickAddInput";

const useStylesForContentInputToolbar = makeStyles((theme) => ({
  appBarRoot: {
    backgroundColor: "transparent",
    flexShrink: "inherit",
  },
  toolbar: {
    minHeight: "auto",
    padding: "2px 6px",
  },
  divider: {
    margin: "0 6px",
  },
}));

const ContentInputToolbar = ({
  contentType,
  onAddSection = (f) => f,
  onSelectTemplate = (f) => f,
}) => {
  const classes = useStylesForContentInputToolbar();
  return (
    <AppBar
      position="static"
      className={classes.appBarRoot}
      square={true}
      elevation={0}
    >
      <Toolbar
        disableGutters
        variant="dense"
        classes={{
          dense: classes.toolbar,
        }}
      >
        {contentType === "nestedContent" && (
          <>
            <Divider
              orientation="vertical"
              flexItem
              className={classes.divider}
            />
            <QuickAddInput label="Add Section" onSubmit={onAddSection} />
            <Divider
              orientation="vertical"
              flexItem
              className={classes.divider}
            />
            <SelectTemplate onSelect={onSelectTemplate} />
          </>
        )}
      </Toolbar>
    </AppBar>
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
    background: "white",
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
    <CustomTextField
      value={value}
      onChange={handleChange}
      select
      id="selectTemplate"
      label="Template"
      overflow="hidden"
      SelectProps={{
        classes: {
          root: classes.select,
        },
        displayEmpty: true,
        MenuProps: {
          classes: {
            list: classes.menuList,
          },
          PaperProps: {
            className: classes.menuPaper,
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
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
    </CustomTextField>
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
