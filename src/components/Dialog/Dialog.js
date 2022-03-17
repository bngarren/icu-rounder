import * as React from "react";

// MUI
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Typography,
} from "@mui/material";

// Util
import { v4 as uuidv4 } from "uuid";

const TRANSITION_DURATION = 50; //ms

const DialogContext = React.createContext();

const DialogProvider = ({ children }) => {
  const [, setOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState(null);

  const close = () => {
    setOpen(false);
    setDialog(null);
  };

  /* Shows the dialog component and returns a promise.
  This is a curried function. The first partial function accepts the
  default template for this type of dialog, and the second partial function 
  accepts the custom template, i.e. the specific language and variables to use */
  const openDialog = React.useCallback(
    (defaultTemplate, allowClickAway = false) =>
      (customTemplate) => {
        const template = { ...defaultTemplate, ...customTemplate };

        /* Customize how this dialog responds to a close request,
        i.e. "escapeKeyDown" or "backdropClick". 
        By default, if we allow this kind of close, we will resolve
        the dialog to false, akin to the user canceling */
        const handleOnClose = (reason, resolve) => {
          if (reason === "backdropClick" && !allowClickAway) {
            return;
          } else {
            close();
            resolve(false);
          }
        };

        /* We return a promise that resolves to a value equal to
    the user's choice */
        return new Promise((resolve) => {
          const onChoose = (answer) => (e) => {
            e.preventDefault();
            close();
            resolve(answer);
          };
          setDialog(
            <Dialog
              sx={{
                "&. MuiPaper-root": {
                  whiteSpace: "pre-line",
                },
              }}
              open={true}
              onClose={(_, reason) => handleOnClose(reason, resolve)}
              transitionDuration={TRANSITION_DURATION}
            >
              <DialogTitle>{template.title}</DialogTitle>
              <DialogContent>
                <DialogContentText
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {Array.isArray(template.content) ? (
                    template.content.map((el) => (
                      <Typography
                        variant="body1"
                        component="span"
                        key={uuidv4()}
                      >
                        {el}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body1" component="span">
                      {template.content}
                    </Typography>
                  )}
                </DialogContentText>
                <DialogContentText
                  variant="body1"
                  align="center"
                  sx={{ marginTop: "15px", fontWeight: "bold" }}
                >
                  {template.prompt}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={onChoose(true)}>
                  {template.labels?.ok ?? "Okay"}
                </Button>
                <Button onClick={onChoose(false)} autoFocus>
                  {template.labels?.cancel ?? "Cancel"}
                </Button>
              </DialogActions>
            </Dialog>
          );
        });
      },
    []
  );

  return (
    <DialogContext.Provider
      value={{
        confirm: openDialog(DEFAULT_CONFIRM, true),
      }}
    >
      {children}
      {dialog}
    </DialogContext.Provider>
  );
};

export default DialogProvider;

export const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error(
      "useDialog must be consumed within a DialogProvider component."
    );
  }
  return context;
};

const DEFAULT_CONFIRM = {
  title: "Please confirm:",
  content: [],
  prompt: "Do you want to continue?",
  labels: {
    ok: "Yes",
    cancel: "Cancel",
  },
};
