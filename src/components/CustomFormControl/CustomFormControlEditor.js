import { useState, useEffect, cloneElement, useCallback } from "react";

const CustomFormControlEditor = ({
  initialValue,
  id,
  onInputChange = (f) => f,
  onDiffChange = (f) => f,
  onBlur = (f) => f,
  onChangeArgument = 0,
  children,
}) => {
  const [value, setValue] = useState(initialValue);
  const [diff, setDiff] = useState(false);

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

  /* Our custom onChange function that we inject into the child component.
  Since some components differ in the parameters they send to their onChange callback, 
  i.e. Autocomplete, ToggleContentType, we receive all possible ...args here, and choose the one
  we want via prop. HACKY, but works for now. */
  const handleOnChange = useCallback(
    (...args) => {
      const val =
        onChangeArgument === 0
          ? args[onChangeArgument].target.value
          : args[onChangeArgument];

      setDiff(!(val === initialValue));

      setValue(val);

      // notify parent
      onInputChange(id, val);
    },
    [id, initialValue, onChangeArgument, onInputChange]
  );

  const childElement = cloneElement(children, {
    value: value,
    onChange: handleOnChange,
    onBlur: onBlur,
    id: id,
    diff: diff,
  });

  return <>{childElement}</>;
};

export default CustomFormControlEditor;
