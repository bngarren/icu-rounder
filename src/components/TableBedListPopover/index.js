// MUI
import { Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/system";

import { bindMenu } from "material-ui-popup-state/hooks";

/* Styling */
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: "1rem",
}));

const TableBedListPopover = ({
  popupState,
  emptyBed,
  onSelectDelete = (f) => f,
  onSelectClear = (f) => f,
}) => {
  const handleSelectDelete = () => {
    popupState.close();
    onSelectDelete();
  };
  const handleSelectClear = () => {
    popupState.close();
    onSelectClear();
  };

  return (
    <>
      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {!emptyBed && (
          <StyledMenuItem onClick={handleSelectClear} key="clear">
            Clear bed
          </StyledMenuItem>
        )}
        <StyledMenuItem onClick={handleSelectDelete} key="delete">
          Remove bed
        </StyledMenuItem>
      </Menu>
    </>
  );
};

export default TableBedListPopover;
