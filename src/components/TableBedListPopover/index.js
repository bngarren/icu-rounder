import { makeStyles } from "@mui/styles";
import { Menu, MenuItem, Divider } from "@mui/material";

import { bindMenu } from "material-ui-popup-state/hooks";

const useStyles = makeStyles({
  menuItem: {
    fontSize: "10pt",
  },
});

const TableBedListPopover = ({
  popupState,
  emptyBed,
  onSelectDelete = (f) => f,
  onSelectClear = (f) => f,
}) => {
  const classes = useStyles();

  const handleSelectDelete = () => {
    popupState.close();
    onSelectDelete();
  };
  const handleSelectClear = () => {
    popupState.close();
    onSelectClear();
  };

  return (
    <div className={classes.root}>
      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {!emptyBed && (
          <MenuItem
            className={classes.menuItem}
            onClick={handleSelectClear}
            key="clear"
          >
            Clear
          </MenuItem>
        )}
        <MenuItem
          className={classes.menuItem}
          onClick={handleSelectDelete}
          key="delete"
        >
          Remove bed
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TableBedListPopover;
