import { useEffect, useState } from "react";

import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  inputFile: {},
  preview: {
    fontSize: "10pt",
  },
});

const Importer = ({ onNewDataSelected = (f) => f }) => {
  const classes = useStyles();
  const [file, setFile] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    if (!file) return;

    const getDataFromFile = () => {
      const fr = new FileReader();
      fr.onload = async (e) => {
        const result = await JSON.parse(e.target.result);

        try {
          const modifiedResult = getModifiedJSON(result);
          setData(modifiedResult);
          onNewDataSelected(modifiedResult);
        } catch (err) {
          console.error(`Error in Importer: ${err.message}`);
        }
      };

      fr.readAsText(file, "application/json");
    };
    getDataFromFile(file);
  }, [file, onNewDataSelected]); //onNewDataSelected is memoized in SettingsPage

  const handleImportAction = (e) => {
    const files = e.target.files;
    if (files.length <= 0) {
      return false;
    } else if (files.length > 1) {
      console.log("Should not select more than 1 file for import.");
    }
    setFile(files[0]);
  };

  const formatted = JSON.stringify(data, null, 2);

  return (
    <div>
      <input
        id="inputFile"
        className={classes.inputFile}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={handleImportAction}
      />
      <label htmlFor="inputFile">
        <Button
          variant="contained"
          color="secondary"
          component="span"
          size="small"
        >
          File...
        </Button>
        {file && file.name}
      </label>
      {data && (
        <div>
          <TextField
            multiline
            fullWidth
            disabled
            size="medium"
            rowsMax={20}
            value={formatted}
            InputProps={{
              classes: {
                root: classes.preview,
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

/* Helper function to take the imported JSON data and clean it.
E.g., remove objects who have empty beds or empty data */
const getModifiedJSON = (dirtyJSON) => {
  const cleanJSON = [];

  // make sure it's an array
  if (dirtyJSON instanceof Array) {
    dirtyJSON.forEach((element) => {
      // each element in the array should be an object
      if (element instanceof Object) {
        // object has no keys, i.e. is empty
        if (Object.keys(element).length === 0) return; // skip this element

        // if no bed key, skip this element
        if (element.bed === "") return;

        // workaround for data exported from Excel grid at BCH
        if (
          (!element.firstName || element.firstName === "0") &&
          (!element.lastName || element.lastName === "0")
        ) {
          cleanJSON.push({ bed: element.bed });
        } else {
          cleanJSON.push(element);
        }
      } else {
        // All elements in this imported array are expected to be Objects
        throw new Error(
          "Imported data has an element that is not of type Object."
        );
      }
    });
  } else {
    throw new Error("Imported data is not an array structure.");
  }

  return cleanJSON;
};

export default Importer;
