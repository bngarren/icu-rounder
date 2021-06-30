import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Divider,
  Select,
  InputBase,
  MenuItem,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";

import CustomTextField from "./CustomTextField";
import QuickAddInput from "./QuickAddInput";

const useStylesForContentInputToolbar = makeStyles((theme) => ({
  appBarRoot: {
    backgroundColor: "transparent",
    borderBottom: "1px solid #eee",
  },
  toolbar: {
    minHeight: "auto",
    padding: "2px 4px",
  },
  divider: {
    margin: "0 4px",
  },
}));

const ContentInputToolbar = ({
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
        <QuickAddInput label="Add Section" onSubmit={onAddSection} />
        <Divider orientation="vertical" flexItem className={classes.divider} />
        <SelectTemplate onSelect={onSelectTemplate} />
      </Toolbar>
    </AppBar>
  );
};

const useStylesForSelectTemplate = makeStyles((theme) => ({
  select: {
    minWidth: "100px",
    background: "white",
    color: "grey",
    border: "1px dotted grey",
    borderRadius: "4px",
    "&:hover": {
      borderColor: "grey",
    },
    "&:focus": {
      borderRadius: "4px",
      background: "white",
      borderColor: theme.palette.secondary.main,
    },
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
      SelectProps={{
        classes: {
          root: classes.select,
        },
        displayEmpty: true,
        MenuProps: {
          classes: {
            list: classes.menuList,
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
