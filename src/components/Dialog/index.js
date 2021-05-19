import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  paper: {
    whiteSpace: "pre-line",
  },
});

const TRANSITION_DURATION = 50; //ms

export const useDialog = () => {
  const classes = useStyles();
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
      <Dialog
        classes={{ paper: classes.paper }}
        open={true}
        onClose={handleOnClose}
        transitionDuration={TRANSITION_DURATION}
      >
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOnAction(onSubmit)}>
            {buttonLabels.yes}
          </Button>
          <Button onClick={() => handleOnAction(onCancel)} autoFocus>
            {buttonLabels.no}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return {
    dialogIsOpen: open,
    dialog,
    showYesNoDialog,
  };
};
