import { useState, useEffect } from "react";

import { InputAdornment, IconButton, Fade } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddBoxIcon from "@material-ui/icons/AddBox";

//components
import CustomTextField from "./CustomTextField";

const useStylesForQuickAddInput = makeStyles((theme) => ({
  iconButton: {
    padding: 2,
  },
  icon: {
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.secondary.light,
    },
  },
}));

const QuickAddInput = ({ onSubmit = (f) => f, reset, ...props }) => {
  const classes = useStylesForQuickAddInput();
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    onSubmit(value || null);
    setValue("");
  };

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  /* Use the reset prop to know when the input should clear,
  E.g., a new section has been selected */
  useEffect(() => {
    setValue("");
  }, [reset]);

  return (
    <div>
      <CustomTextField
        value={value}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Fade in={value !== null && value !== ""}>
                <IconButton
                  onClick={handleSubmit}
                  className={classes.iconButton}
                >
                  <AddBoxIcon className={classes.icon} />
                </IconButton>
              </Fade>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </div>
  );
};

export default QuickAddInput;
