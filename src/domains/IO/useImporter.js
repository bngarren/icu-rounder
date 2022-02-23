import * as React from "react";

// Util
import { readFileAsync, getCleanedAndValidatedData } from "../../utils";
import { v4 as uuidv4 } from "uuid";

/* 
Empty = waiting for user to click import button
Pending = data uploaded, awaiting confirmation
Confirmed = data has been saved
 */
const STATUS = Object.freeze({
  Empty: "EMPTY",
  Pending: "PENDING",
  Confirmed: "CONFIRMED",
  Loading: "LOADING",
});

export const useImporter = () => {
  const [file, setFile] = React.useState(null);
  const [importedData, setImportedData] = React.useState(null);
  const [status, setStatus] = React.useState(STATUS.Empty);
  const [error, setError] = React.useState(false);

  /* A ref is used to signify this component being mounted (true) or not. 
  This helps handle the edge case that a file is being read async but the component 
  unmounts before the promise returns */
  const componentMounted = React.useRef(false);

  React.useEffect(() => {
    componentMounted.current = true;
    return () => {
      componentMounted.current = false;
    };
  }, []);

  /* This useEffect fires when a new file has been selected.
  
  It starts with reading the contents of the file in async fashion. 
  Then, it will try to parse the JSON - will error if lacking basic JSON validity.
  Next, it will validate the imported object with our custom function. 
  Finally, it will set the importedData state variable to contain the contents
  of the imported JSON object, which includes a gridData array but also metadata. 
  
  */
  React.useEffect(() => {
    if (!file) return;

    setStatus(STATUS.Loading);
    setError(false);

    let raw;
    readFileAsync(file)
      .then((result) => {
        if (componentMounted.current) {
          try {
            raw = JSON.parse(result);
          } catch (err) {
            console.error(`Could not parse uploaded JSON. ${err}`);
            setStatus(STATUS.Empty);
            setError(true);
            return;
          }
          // Validate JSON object

          let res = { cleanedData: {}, errors: [] };
          try {
            /* The getCleanedAndValidated function should return an object */
            res = getCleanedAndValidatedData(raw);

            /* Add a unique id to each gridDataElement */
            res.cleanedData?.gridData?.forEach((gde) => {
              gde.id = uuidv4();
            });
          } catch (err) {
            console.error(`Could not validate imported JSON. ${err}`);
            setError(true);
          } finally {
            res.errors.length > 0 && console.warn(res.errors);
          }

          // Set new JSON as the imported data
          setImportedData(res.cleanedData);
          setStatus(STATUS.Pending);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  }, [file]);

  /**
   * Handles the file upload action, e.g. button click of
   * an html input with type="file"
   * @param {object} e Event object
   * @returns File object, null otherwise
   */
  const handleFileUploadAction = (e) => {
    const files = e.target.files;
    if (!files) {
      return null;
    }
    if (files.length <= 0) {
      return null;
    } else if (files.length > 1) {
      console.error("Should not select more than 1 file for import.");
    } else {
      setFile(files[0]);
      return files[0];
    }
  };

  const handleConfirmAction = React.useCallback(() => {
    setStatus(STATUS.Confirmed);
    setImportedData(null);
    setError(false);
  }, []);

  const handleResetAction = React.useCallback(() => {
    setFile(null);
    setImportedData(null);
    setStatus(STATUS.Empty);
    setError(false);
  }, []);

  return {
    file: file,
    importedData: importedData,
    upload: handleFileUploadAction,
    confirm: handleConfirmAction,
    cancel: handleResetAction,
    status: status,
    STATUS: STATUS, //enum
    error: error,
  };
};
