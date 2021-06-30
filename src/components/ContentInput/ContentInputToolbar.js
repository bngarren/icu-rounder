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

import QuickAddInput from "./QuickAddInput";

const useStylesForContentInputToolbar = makeStyles((theme) => ({
  appBarRoot: {
    backgroundColor: "transparent",
    borderBottom: "1px solid #eee",
  },
  toolbar: {
    minHeight: "auto",
    padding: "2px 0px",
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
        <QuickAddInput placeholder="Add Section" onSubmit={onAddSection} />
        <Divider orientation="vertical" flexItem />
        <SelectTemplate onSelect={onSelectTemplate} />
      </Toolbar>
    </AppBar>
  );
};

const useStylesForSelectTemplate = makeStyles((theme) => ({}));

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
    <Select value={value} onChange={handleChange} displayEmpty>
      <MenuItem value="">Template</MenuItem>
      {OPTIONS.map((option) => {
        return (
          <MenuItem key={option.id} value={option.value}>
            {option.name}
          </MenuItem>
        );
      })}
    </Select>
  );
};

const OPTIONS = [
  {
    id: 1,
    name: "Systems",
    value: ["NEURO", "RESP", "CV", "FEN", "ID", "HEME", "ENDO", "ACCESS"],
  },
];

export default ContentInputToolbar;
