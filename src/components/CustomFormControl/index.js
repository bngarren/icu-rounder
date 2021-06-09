import { useState, useEffect, cloneElement } from "react";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  unsaved: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const CustomFormControl = ({ initialValue, children }) => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [diff, setDiff] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleOnChange = (val) => {
    if (val === initialValue) {
      setDiff(false);
    } else {
      setDiff(true);
    }
    setValue(val);
  };

  return (
    <div className={clsx(classes.root, { [classes.unsaved]: diff })}>
      {cloneElement(children, {
        value: value,
        onChange: (e) => handleOnChange(e.target.value),
      })}
    </div>
  );
};

export default CustomFormControl;
