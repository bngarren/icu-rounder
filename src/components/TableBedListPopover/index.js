import { makeStyles } from "@material-ui/styles";
import { Menu, MenuItem } from "@material-ui/core";

import { bindMenu } from "material-ui-popup-state/hooks";

const useStyles = makeStyles({});

const TableBedListPopover = ({ popupState, onSelectDelete = (f) => f }) => {
  const classes = useStyles();

  const handleSelectDelete = () => {
    popupState.close();
    onSelectDelete();
  };

  return (
    <div className={classes.root}>
      <Menu
        {...bindMenu(popupState)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={handleSelectDelete}>Remove bed</MenuItem>
        <MenuItem>Move to...</MenuItem>
      </Menu>
    </div>
  );
};

export default TableBedListPopover;
