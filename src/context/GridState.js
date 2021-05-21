import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { useSettings } from "../context/Settings";
import { useAuthStateContext } from "../context/AuthState";

// Utility
import { sortByBed } from "../utils/Utility";

/* Takes the array of non-empty beds (i.e. the data
    and merges with a "bedLayout" which is a total number of bedspaces
    Also excludes beds as specified in the BED_LAYOUT.exclude array */
const mergeWithBedLayout = (arr, bedLayout) => {
  if (typeof arr === "undefined") {
    throw new Error(`Cannot mergeWithBedLayout, invalid input array.`);
  }
  if (typeof bedLayout === "undefined" || bedLayout.length === 0) {
    console.log(
      "Invalid bedLayout passed to mergeWithBedLayout. Using default 30 beds."
    );
    bedLayout = Array.from(new Array(30), (x, i) => i + 1);
  }

  let resultArray = [];
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
  return resultArray;
};

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
  const { authState } = useAuthStateContext();
  const [gridData, setGridData] = useState();
  const [gridDataJson, setGridDataJson] = useState();
  const { settings } = useSettings();

  const updateGridData = useCallback(
    (data) => {
      // ..verify input data
      const verifiedData = data;

      // Put each bedspace data object into an array
      let arr = [];
      if (verifiedData) {
        for (let i in verifiedData) {
          arr.push(verifiedData[i]);
        }
      }
      /* Sort the array by bedspace and make sure the data conforms
    to the bedLayout */
      try {
        const mergedData = mergeWithBedLayout(arr, settings.bedLayout);
        const sortedArrayData = sortByBed(mergedData);
        setGridData(sortedArrayData);
        setGridDataJson(getJsonObjectFromSortedArray(sortedArrayData));
      } catch (error) {
        console.error(
          `Error updating grid in GridStateProvider: ${error.message}`
        );
      }
    },
    [settings.bedLayout]
  );

  /* Try to get data from localStorage,
  if not, initialize the grid data with an empty array by passing null */
  useEffect(() => {
    try {
      const localStorageGridData = JSON.parse(localStorage.getItem("gridData"));
      if (localStorageGridData != null && localStorageGridData !== "") {
        updateGridData(localStorageGridData);
        console.log("Initialing gridData with localStorage data.");
      } else {
        throw new Error("Could not load localStorage gridData or it is null.");
      }
    } catch (err) {
      console.log(err.message);
      updateGridData(null);
      console.log("Initialing gridData with empty array data.");
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
      value={{ gridData, gridDataJson, updateGridData }}
    >
      {children}
    </GridStateContext.Provider>
  );
}

export const useGridStateContext = () => useContext(GridStateContext);
