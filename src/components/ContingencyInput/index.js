import { useState } from "react";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

const ContingencyInput = ({ items: initialItems }) => {
  const [currentItems, setCurrentItems] = useState(
    initialItems ? initialItems : []
  );

  return (
    <Autocomplete
      fullWidth
      multiple
      freeSolo
      id="tags-outlined"
      options={[]}
      value={currentItems}
      onChange={(e, value) => setCurrentItems(value)}
      noOptionsText={""}
      renderInput={(params) => <TextField {...params} variant="outlined" />}
    />
  );
};

export default ContingencyInput;
