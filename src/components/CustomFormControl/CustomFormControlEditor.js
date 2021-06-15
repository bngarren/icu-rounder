import { useState, useEffect, cloneElement } from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({}));

const CustomFormControlEditor = ({
  initialValue,
  id,
  onDiffChange = (f) => f,
  children,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [diff, setDiff] = useState(false);

  const childElement = cloneElement(children, {
    value: value,
    onChange: (e) => handleOnChange(e.target.value),
    id: id,
  });

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  /* 
  **
  Each time the diff is changed, i.e. the input goes from
  needsSave to initialValue or vice versa, call the callback from
  the parent component.
  This lets the parent component keep track of when a save is needed or not 
  **
  */
  useEffect(() => {
    onDiffChange(id, diff);
  }, [diff, id, onDiffChange]);

  const handleOnChange = (val) => {
    if (val === initialValue) {
      setDiff(false);
    } else {
      setDiff(true);
    }
    setValue(val);
  };

  return { childElement };
};

export default CustomFormControlEditor;
