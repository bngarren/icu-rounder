import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";

const Exporter = () => {
  const [data, setData] = useState();

  useEffect(() => {
    // Get local data
    const localData = JSON.parse(localStorage.getItem("gridData"));
    setData(localData);
  }, []);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, "grid.json");
  };

  return (
    <div>
      <Button onClick={handleExport}>Export grid</Button>
    </div>
  );
};

export default Exporter;
