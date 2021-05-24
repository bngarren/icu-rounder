import { makeStyles } from "@material-ui/styles";
import { Menu, MenuItem, Divider } from "@material-ui/core";

import { bindMenu } from "material-ui-popup-state/hooks";

const useStyles = makeStyles({});

const TableBedListPopover = ({
  popupState,
  onSelectDelete = (f) => f,
  onSelectMoveTo = (f) => f,
}) => {
  const classes = useStyles();

  const handleSelectDelete = () => {
    popupState.close();
    onSelectDelete();
  };
  const handleSelectMoveTo = () => {
    popupState.close();
    onSelectMoveTo();
  };

  return (
    <div className={classes.root}>
      <Menu
        {...bindMenu(popupState)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={handleSelectMoveTo}>Move to...</MenuItem>
        <Divider />
        <MenuItem onClick={handleSelectDelete}>Remove bed</MenuItem>
      </Menu>
    </div>
  );
};

export default TableBedListPopover;
