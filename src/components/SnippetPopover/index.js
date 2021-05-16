import { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import Fade from "@material-ui/core/Fade";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { bindPopper } from "material-ui-popup-state/hooks";

const useStyles = makeStyles({
  root: {},
  popper: {
    border: "1px solid rgba(27,31,35,.15)",
    boxShadow: "0 3px 12px rgba(27,31,35,.15)",
    borderRadius: 3,
    width: 300,
    zIndex: 1,
    fontSize: 13,
    color: "#586069",
    backgroundColor: "#f6f8fa",
  },
  header: {
    borderBottom: "1px solid #e1e4e8",
    padding: "8px 10px",
    fontWeight: 600,
  },
  closeButton: {
    padding: "2px",
  },
  autocompletePaper: {
    boxShadow: "none",
    margin: 0,
    color: "#586069",
    fontSize: 14,
  },
  option: {
    minHeight: "auto",
    alignItems: "flex-start",
    padding: 3,
    '&[aria-selected="true"]': {
      backgroundColor: "transparent",
    },
    '&[data-focus="true"]': {
      backgroundColor: "#b7d100",
    },
    fontSize: 12,
  },
  optionText: {},
  popperDisablePortal: {
    position: "relative",
  },
  textFieldRoot: {
    overflow: "hidden",
    width: "100%",
    borderRadius: 1,
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
    "&$textFieldFocused": {
      backgroundColor: "#fff",
      borderColor: "#b7d100",
      borderRight: 0,
      borderLeft: 0,
    },
    "& .MuiFilledInput-input": {
      padding: "5px",
    },
  },
  textFieldFocused: {},
  textFieldInputLabelRoot: {
    color: "#9caa3d",
    fontSize: "11pt",
    "&$textFieldInputLabelFocused": {
      color: "#094D92",
    },
  },
  textFieldInputLabelFocused: {},
});

const SnippetPopover = ({ popupState, onSelect = (f) => f }) => {
  const classes = useStyles();
  const snippets = useRef(null);

  useEffect(() => {
    //Load in snippets
    snippets.current = SNIPPETS;
  }, []);

  const handleSelect = (selection) => {
    onSelect(selection);
    popupState.close();
  };

  const handleClose = (e) => {
    popupState.close();
  };

  return (
    <div className={classes.root}>
      <ClickAwayListener onClickAway={() => popupState.close()}>
        <Popper
          {...bindPopper(popupState)}
          className={classes.popper}
          transition
          placement={"top-start"}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={{ enter: 350, exit: 50 }}>
              <div>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className={classes.header}
                >
                  Choose snippet to insert
                  <IconButton
                    className={classes.closeButton}
                    onClick={handleClose}
                  >
                    <CloseIcon size="small" />
                  </IconButton>
                </Grid>
                <Autocomplete
                  debug={false}
                  id="search"
                  classes={{
                    option: classes.option,
                    paper: classes.autocompletePaper,
                    popperDisablePortal: classes.popperDisablePortal,
                  }}
                  options={snippets.current}
                  getOptionLabel={(option) => option.key}
                  openOnFocus
                  selectOnFocus
                  autoHighlight
                  autoComplete
                  clearOnBlur
                  disablePortal
                  size="small"
                  onChange={(e, newValue) => handleSelect(newValue.content)}
                  onClose={(e, reason) => console.log(reason)}
                  renderInput={(params) => (
                    <TextField
                      variant="filled"
                      autoFocus={true}
                      fullWidth={true}
                      InputProps={{
                        classes: {
                          root: classes.textFieldRoot,
                          focused: classes.textFieldFocused,
                        },
                        disableUnderline: true,
                        inputProps: {
                          ...params.inputProps,
                        },
                        ref: params.InputProps.ref,
                      }}
                      InputLabelProps={{
                        classes: {
                          root: classes.textFieldInputLabelRoot,
                          focused: classes.textFieldInputLabelFocused,
                        },
                      }}
                    />
                  )}
                  renderOption={(option, { selected }) => (
                    <>
                      <div className={classes.optionText}>{option.key}</div>
                    </>
                  )}
                  noOptionsText="No snippets"
                />
              </div>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </div>
  );
};

const SNIPPETS = [
  { key: "sedation", content: "Mo, Mz, Dex gtts" },
  { key: "systems", content: "NEURO:\nRESP:\nCV:\nFEN:\nID:\nHEME:\nENDO:" },
  { key: "crit airway", content: "*CRITICAL AIRWAY*" },
  { key: "crit brain", content: "*CRITICAL BRAIN*" },
  { key: "no ecmo", content: "*NO ECMO*" },
  { key: "ORL STAT", content: "*ORL STAT*" },
  { key: "GT feeds", content: "GT full feeds" },
  { key: "SDS contingency", content: "would need SDS" },
];

export default SnippetPopover;
