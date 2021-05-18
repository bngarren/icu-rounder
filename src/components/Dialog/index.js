import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";

const TRANSITION_DURATION = 50; //ms

export const useDialog = () => {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(null);

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleOnAction = (cb) => {
    handleOnClose();
    cb();
  };

  const showYesNoDialog = (
    content = "",
    onSubmit = () => console.log("Dialog sumbit."),
    onCancel = () => console.log("Dialog cancel."),
    buttonLabels = { yes: "Yes", no: "Cancel" }
  ) => {
    if (!content) {
      throw new Error("Cannot show Dialog without content.");
    } else if (open) {
      throw new Error("Dialog is already open.");
    }

    setOpen(true);

    setDialog(
      <Dialog open={true} onClose={handleOnClose} transitionDuration={TRANSITION_DURATION}>
        {content}
        <Button onClick={() => handleOnAction(onSubmit)}>{buttonLabels.yes}</Button>
        <Button onClick={() => handleOnAction(onCancel)}>{buttonLabels.no}</Button>
      </Dialog>
    );
  };

  return {
    dialogIsOpen: open,
    dialog,
    showYesNoDialog,
  };
};
