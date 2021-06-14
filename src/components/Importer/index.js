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
        setData(result);
        onNewDataSelected(result);
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
          Upload
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

export default Importer;
