import { useEffect, useState, cloneElement } from "react";
import { saveAs } from "file-saver";

import { useGridStateContext } from "../../context/GridState";

const exportDataWithFilename = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, `${filename}.json`);
};

/* This component will add an onClick function to its children component that
will export the grid data to json. 
E.g. If Exporter surrounds a Button component it will add onClick function
*/
const Exporter = ({ children, filename = "grid", onExported = (f) => f }) => {
  const [data, setData] = useState(); // local data in the Exporter component
  const { gridDataJson } = useGridStateContext();

  useEffect(() => {
    // Get gridData from the GridStateContext
    setData(gridDataJson);
  }, [gridDataJson]);

  const handleExport = () => {
    exportDataWithFilename(data, filename);
    onExported();
  };

  return cloneElement(children, { onClick: handleExport });
};

export default Exporter;
