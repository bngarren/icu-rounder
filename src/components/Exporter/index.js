import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";

import { useGridStateContext } from "../../context/GridState";

const Exporter = () => {
  const [data, setData] = useState(); // local data in the Exporter component
  const { gridDataJson } = useGridStateContext();

  useEffect(() => {
    // Get gridData from the GridStateContext
    setData(gridDataJson);
  }, [gridDataJson]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "grid.json"); // TODO maybe the filename can be set in Settings
  };

  return (
    <div>
      <Button onClick={handleExport}>Export grid</Button>
    </div>
  );
};

export default Exporter;
