import { useState, useEffect, cloneElement, useCallback } from "react";
import { makeStyles } from "@material-ui/styles";

// lodash
import { debounce } from "lodash";

const useStyles = makeStyles((theme) => ({}));

const CustomFormControlEditor = ({
  initialValue,
  id,
  onInputChange = (f) => f,
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

  /* Each time a default value comes through as a prop,
  reset this component's value to that, and set diff to false */
  useEffect(() => {
    setValue(initialValue);
    setDiff(false);
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
    setDiff(!(val === initialValue));

    setValue(val);

    // notify parent
    onInputChange(id, val);
  };

  return <>{childElement}</>;
};

export default CustomFormControlEditor;
