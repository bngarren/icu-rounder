import { useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import makeStyles from '@mui/styles/makeStyles';

import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import Fade from "@mui/material/Fade";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { bindPopper } from "material-ui-popup-state/hooks";

const useStyles = makeStyles((theme) => ({
  root: {},
  popper: {
    border: "1px solid rgba(27,31,35,.15)",
    boxShadow: "0 3px 12px rgba(27, 31, 35, 0.33)",
    borderRadius: 3,
    width: 300,
    zIndex: 1,
    fontSize: 13,
    color: "#586069",
  },
  header: {
    borderBottom: "1px solid #e1e4e8",
    padding: "8px 10px",
    fontWeight: 600,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  closeButton: {
    padding: "2px",
    color: theme.palette.secondary.contrastText,
  },
  autocompletePaper: {
    boxShadow: "none",
    margin: 0,
    color: "#586069",
    fontSize: 14,
    backgroundColor: "#f6f8fa",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  },
  listbox: {
    padding: "0px 4px",
  },
  option: {
    minHeight: "auto",
    alignItems: "flex-start",
    padding: "3px 3px 3px 8px",
    borderRadius: "4px",
    '&[aria-selected="true"]': {
      backgroundColor: "transparent",
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
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
    backgroundColor: "white",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: "white",
    },
    borderBottom: "1px solid #dcdcdc",
    "&$textFieldFocused": {
      backgroundColor: "white",
    },
    "& .MuiFilledInput-input": {
      padding: "5px 5px 5px 8px",
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
}));

const SnippetPopover = ({ popupState, onSelect = (f) => f }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
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
          placement={"top"}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={{ enter: 350, exit: 0 }}>
              <div>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  className={classes.header}
                >
                  Choose snippet to insert
                  <IconButton className={classes.closeButton} onClick={handleClose} size="large">
                    <CloseIcon size="small" />
                  </IconButton>
                </Grid>
                <Autocomplete
                  debug={true}
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
                  ListboxProps={{
                    className: classes.listbox,
                  }}
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
