import { useRef, useEffect } from "react";

// MUI
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import Fade from "@mui/material/Fade";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { bindPopper } from "material-ui-popup-state/hooks";

/* Styling */

const StyledRootBox = styled(Box, {
  name: "SnippetPopover",
  slot: "Root",
})(() => ({}));

const StyledPopper = styled(Popper, {
  name: "SnippetPopover",
  slot: "popper",
})(() => ({
  border: "1px solid rgba(27,31,35,.15)",
  boxShadow: "0 3px 12px rgba(27, 31, 35, 0.33)",
  borderRadius: 3,
  width: 300,
  zIndex: 1,
  fontSize: 13,
  color: "#586069",
}));

const StyledAutocomplete = styled(Autocomplete, {
  name: "SnippetPopover",
  slot: "autocomplete",
})(() => ({
  "& .MuiAutocomplete-paper": {
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
  "& .MuiAutocomplete-listbox": {
    padding: "0px 4px",
  },
}));

const SnippetPopover = ({ popupState, onSelect = (f) => f }) => {
  const snippets = useRef(null);

  useEffect(() => {
    //Load in snippets
    snippets.current = SNIPPETS;
  }, []);

  const handleSelect = (selection) => {
    onSelect(selection);
    popupState.close();
  };

  const handleClose = () => {
    popupState.close();
  };

  return (
    <StyledRootBox>
      <ClickAwayListener onClickAway={() => popupState.close()}>
        <StyledPopper {...bindPopper(popupState)} transition placement={"top"}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={{ enter: 350, exit: 0 }}>
              <div>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    borderBottom: "1px solid #e1e4e8",
                    padding: "8px 10px",
                    fontWeight: 600,
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                >
                  Choose snippet to insert
                  <IconButton
                    sx={{
                      padding: "2px",
                      color: "primary.main",
                    }}
                    onClick={handleClose}
                    size="large"
                  >
                    <CloseIcon size="small" />
                  </IconButton>
                </Grid>
                <StyledAutocomplete
                  id="search"
                  options={snippets.current}
                  getOptionLabel={(option) => option.key}
                  openOnFocus
                  selectOnFocus
                  autoHighlight
                  autoComplete
                  clearOnBlur
                  size="small"
                  onChange={(e, newValue) => handleSelect(newValue.content)}
                  onClose={(e, reason) => console.log(reason)}
                  renderInput={(params) => (
                    <TextField
                      variant="filled"
                      autoFocus={true}
                      fullWidth={true}
                      sx={{
                        overflow: "hidden",
                        width: "100%",
                        backgroundColor: "white",
                        borderRadius: 0,
                        "&:hover": {
                          backgroundColor: "white",
                        },
                        borderBottom: "1px solid #dcdcdc",
                      }}
                      InputProps={{
                        inputProps: {
                          ...params.inputProps,
                        },
                        ref: params.InputProps.ref,
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box component="span">{option.key}</Box>
                    </li>
                  )}
                  noOptionsText="No snippets"
                />
              </div>
            </Fade>
          )}
        </StyledPopper>
      </ClickAwayListener>
    </StyledRootBox>
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
