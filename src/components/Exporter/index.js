import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";

import { useGridStateContext } from "../../context/GridState";

const exportDataWithFilename = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, `${filename}.json`);
};

const Exporter = ({ filename, onExported = (f) => f }) => {
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

  return <Button onClick={handleExport}>Export grid</Button>;
};

export default Exporter;
