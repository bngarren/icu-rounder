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

  const showDialog = (
    type,
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

    const DialogType = () => {
      switch (type) {
        case "YesNoDialog":
          return (
            <YesNoDialog
              content={content}
              onSubmit={() => handleOnAction(onSubmit)}
              onCancel={() => handleOnAction(onCancel)}
              buttonLabels={buttonLabels}
            />
          );
        case "RequiredInputDialog":
          return (
            <RequiredInputDialog
              content={content}
              onSubmit={() => handleOnAction(onSubmit)}
              onCancel={() => handleOnAction(onCancel)}
              buttonLabels={buttonLabels}
            />
          );
        default:
          throw new Error("No dialog type provided.");
      }
    };

    setDialog(
      <Dialog
        classes={{ paper: classes.paper }}
        open={true}
        onClose={handleOnClose}
        transitionDuration={TRANSITION_DURATION}
      ></Dialog>
    );
  };

  return {
    dialogIsOpen: open,
    dialog,
    showDialog,
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

const RequiredInputDialog = ({
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
