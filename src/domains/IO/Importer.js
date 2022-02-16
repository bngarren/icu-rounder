import { useEffect, useState } from "react";

import { TextField } from "@mui/material";

// Custom components
import { ButtonStandard } from "../../components";

const Importer = ({ onNewDataSelected = (f) => f }) => {
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
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={handleImportAction}
      />
      <label htmlFor="inputFile">
        <ButtonStandard component="span" secondary>
          Import Grid
        </ButtonStandard>
        {file && file.name}
      </label>
      {data && (
        <div>
          <TextField
            multiline
            fullWidth
            disabled
            size="medium"
            maxRows={20}
            value={formatted}
            InputProps={{
              sx: {
                fontSize: "formFontSizeLevel3",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

/* Helper function to take the imported JSON data and clean it.
E.g., remove objects who have empty beds or empty data, Type coercions, etc. */
const getModifiedJSON = (dirtyJSON) => {
  const cleanJSON = [];

  // make sure it's object
  if (dirtyJSON instanceof Object) {
    Object.values(dirtyJSON).forEach((element) => {
      // each key-value in the parent object should be an object
      if (element instanceof Object) {
        let modifiedBedElement = element;

        // parent object has no keys, i.e. is empty
        if (Object.keys(element).length === 0) return; // skip this element

        // if no bed key, skip this element
        if (element.bed === "") return;

        try {
          // for each property of the bed object
          Object.keys(element).forEach((k) => {
            // convert any numbers to strings
            if (typeof element[k] === "number") {
              modifiedBedElement[k] = element[k] + "";
            }

            // these key-values should be Arrays
            if (k === "contingencies" || k === "nestedContent") {
              modifiedBedElement[k] = Array.isArray(element[k])
                ? element[k]
                : [];

              // for NestedContent, every element needs at least an 'id' key
              if (k === "nestedContent" && element[k]?.length > 0) {
                let modifiedNestedContent = [];
                element[k].forEach((l) => {
                  if (l.id) modifiedNestedContent.push(l);
                });
                modifiedBedElement[k] = modifiedNestedContent;
              }
            }
          });
        } catch (err) {
          throw new Error(`Error in converting Number to string: ${err}`);
        }

        //! workaround for data exported from Excel grid at BCH
        if (
          (!element.firstName || element.firstName === "0") &&
          (!element.lastName || element.lastName === "0")
        ) {
          cleanJSON.push({ bed: modifiedBedElement.bed });
        } else {
          cleanJSON.push(modifiedBedElement);
        }
      } else {
        // All elements in this imported array are expected to be Objects
        throw new Error(
          "Imported data has an element that is not of type Object."
        );
      }
    });
  } else {
    throw new Error("Imported data is not an Object");
  }

  return cleanJSON;
};

export default Importer;
