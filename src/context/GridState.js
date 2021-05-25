import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Utility
import { sortByBed } from "../utils/Utility";

/* Takes the array of non-empty beds (i.e. the data)
    and merges with a "bedLayout" which is the array of available bedspaces. */
const mergeWithBedLayout = (arr, bedLayout) => {
  if (typeof arr === "undefined") {
    throw new Error(`Cannot mergeWithBedLayout, invalid input array.`);
  }
  if (bedLayout == null || bedLayout.length === 0) {
    console.log("Invalid or empty bedLayout passed to mergeWithBedLayout.");
    bedLayout = "";
  }

  let resultArray = [];
  if (Array.isArray(bedLayout)) {
    bedLayout.forEach((value, index) => {
      resultArray[index] = { bed: value }; // create each bedspace with just a bed number
      if (arr) {
        arr.forEach((a) => {
          if (a.bed === value) {
            // if there is bed data put it in to that bedspace
            resultArray[index] = a;
          }
        });
      }
    });
  }
  return resultArray;
};

/* Used for importing/exporting actual .Json to file */
const getJsonObjectFromSortedArray = (arr) => {
  // converts the array back to a JSON "object of objects"
  const result = {};
  arr.forEach((b) => {
    result[b.bed] = b;
  });
  return result;
};

const GridStateContext = createContext();

export default function GridStateProvider({ children, Firebase }) {
  const [bedLayout, setBedLayout] = useState();
  const [gridData, setGridData] = useState();
  const [gridDataJson, setGridDataJson] = useState();

  /* Takes input data (full grid) and stores it in state as gridData.
  If a bedLayout parameter is passed, the data will conform to this. If bedLayout is null,
  the bedLayout will conform to the passed data. This allows imported data to
  have a bedLayout conformed to it, but also allows changes to bedLayout during app use
  to cause a change to gridData, i.e. dropping/adding beds. */

  /**
   * @param {object} data Grid data in the form of JSON object (not array)
   * @param {array} bedLayout Array of bed names, e.g. ["1", "2", "2B",] etc.
   */
  const updateGridData = useCallback((data, bedLayout) => {
    // ..verify input data
    const verifiedData = data;

    // Put each bedspace data object into an array
    let arr = [];
    if (verifiedData) {
      for (let i in verifiedData) {
        arr.push(verifiedData[i]);
      }
    }
    /* If bedLayout parameter is null, just conform bedLayout to the data.
    If bedLayout is non-null but empty, we will use it as such, as this may have
    been intended by setting the bedLayout to no beds. */
    let bl = [];
    if (bedLayout == null) {
      arr.forEach((element) => {
        bl.push(element.bed);
      });
    } else {
      bl = bedLayout;
    }

    /* Merge the data with bedLayout array and then sort the data array by bed*/
    try {
      const mergedData = mergeWithBedLayout(arr, bl);
      const sortedArrayData = sortByBed(mergedData);
      setGridData(sortedArrayData);
      setGridDataJson(getJsonObjectFromSortedArray(sortedArrayData));
      setBedLayout(bl);
    } catch (error) {
      console.error(
        `Error updating grid in GridStateProvider: ${error.message}`
      );
    }
  }, []);

  /* Try to get data from localStorage,
  if not, initialize the grid data with an empty array by passing null */
  useEffect(() => {
    let data;
    try {
      const localStorageGridData = JSON.parse(localStorage.getItem("gridData"));
      if (localStorageGridData != null && localStorageGridData !== "") {
        data = localStorageGridData;
        console.log("Initialing gridData from localStorage.");
      } else {
        throw new Error("Could not load localStorage gridData or it is null.");
      }
    } catch (err) {
      console.log(err.message);
      data = null;
      console.log("Initialing gridData with empty data.");
    } finally {
      updateGridData(data);
    }
  }, [updateGridData]);

  /* Each time gridData changes, save to local storage */
  useEffect(() => {
    if (gridData != null) {
      localStorage.setItem("gridData", JSON.stringify(gridData));
      console.log("Saved gridData to localStorage");
    }
  }, [gridData]);

  return (
    <GridStateContext.Provider
      value={{ bedLayout, gridData, gridDataJson, updateGridData }}
    >
      {children}
    </GridStateContext.Provider>
  );
}

export const useGridStateContext = () => useContext(GridStateContext);
