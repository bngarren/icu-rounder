import { cloneElement } from "react";
import { saveAs } from "file-saver";

import { useGridStateContext } from "../../context/GridState";

/* Saves the .json file */
const exportDataWithFilename = (data, filename) => {
  const blob = new Blob([data], {
    type: "application/json",
  });
  saveAs(blob, `${filename}.json`);
};

/* This component will add an onClick function to its children component that
will export the grid data to json. 
E.g. If Exporter surrounds a Button component it will add onClick function
*/
const Exporter = ({ children, filename = "grid", onExported = (f) => f }) => {
  const { gridDataJson } = useGridStateContext();

  const handleExport = () => {
    try {
      exportDataWithFilename(gridDataJson, filename);
    } catch (err) {
      console.error(`Error in Exporter: ${err}`);
    } finally {
      onExported();
    }
  };

  return cloneElement(children, { onClick: handleExport });
};

export default Exporter;
