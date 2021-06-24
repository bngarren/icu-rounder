import { useState, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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

  const handleOnAction = useCallback((cb) => {
    handleOnClose();
    cb();
  }, []);

  const showYesNoDialog = useCallback(
    (
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
          <YesNoDialog
            content={content}
            onSubmit={() => handleOnAction(onSubmit)}
            onCancel={() => handleOnAction(onCancel)}
            buttonLabels={buttonLabels}
          />
        </Dialog>
      );
    },
    [classes.paper, handleOnAction, open]
  );

  return {
    dialogIsOpen: open,
    dialog,
    showYesNoDialog,
  };
};

const YesNoDialog = ({
  content,
  onSubmit = (f) => f,
  onCancel = (f) => f,
  buttonLabels,
}) => {
  return (
    <>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmit}>{buttonLabels.yes}</Button>
        <Button onClick={onCancel} autoFocus>
          {buttonLabels.no}
        </Button>
      </DialogActions>
    </>
  );
};
