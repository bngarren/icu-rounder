import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";

export const YesNoDialog = (
  shouldOpen,
  body = "",
  onYes = (f) => f,
  onNo = (f) => f
) => {
  const [open, setOpen] = useState(shouldOpen);

  useEffect(() => {
    setOpen(true);
  }, [shouldOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleYes = () => {
    onYes();
    handleClose();
  };

  const handleNo = () => {
    onNo();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {body}
      <Button onClick={handleYes}>Okay</Button>
      <Button onClick={handleNo}>Cancel</Button>
    </Dialog>
  );
};
