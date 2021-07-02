import { cloneElement } from "react";
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
   const { gridDataJson } = useGridStateContext();

   const handleExport = () => {
      try {
         exportDataWithFilename(getModifiedData(gridDataJson), filename);
      } catch (err) {
         console.error(`Error in Exporter: ${err}`);
      } finally {
         onExported();
      }
   };

   return cloneElement(children, { onClick: handleExport });
};

/* Helper function to get cleaned/type coerced data for export */
const getModifiedData = (rawData) => {
   let modifiedData = rawData;

   // for each bedspace of the gridData object
   Object.values(modifiedData).forEach((element) => {
      let modifiedBedElement = element;
      // for each property of the bed object
      Object.keys(element).forEach((k) => {
         // convert any numbers to strings
         if (typeof element[k] === "number") {
            modifiedBedElement[k] = element[k] + "";
         }
      });
      modifiedData[element] = modifiedBedElement;
   });
   return modifiedData;
};

export default Exporter;
