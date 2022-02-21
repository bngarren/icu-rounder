import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Utility
import { sortByBed, isBedEmpty } from "../utils";

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

  /* resultArray will begin the formation of our new gridData */
  let resultArray = [];
  if (Array.isArray(bedLayout)) {
    bedLayout.forEach((value, index) => {
      /* For each item declared in bedLayout, at least make an
      object with a "bed" property */
      resultArray[index] = { bed: value };

      /* If there is also gridData (not just a bedLayout),
      let's check to see if there is data for this bed number
      that we need to put down */
      if (arr) {
        arr.forEach((a) => {
          /* If there is data within gridData pertaining to the current bedspace
          within bedLayout, let's add this data */
          if (a.bed === value) {
            resultArray[index] = a;
          }
        });
      }
    });
  }
  return resultArray;
};

const GridStateContext = createContext();

export default function GridStateProvider({ children }) {
  const [bedLayout, setBedLayout] = useState();
  const [gridData, setGridData] = useState();
  const [census, setCensus] = useState();

  /* Takes input data (full grid) and stores it in state as gridData.
  If a bedLayout parameter is passed, the data will conform to this. If bedLayout is null,
  the bedLayout will conform to the passed data. This allows imported data to
  have a bedLayout conformed to it, but also allows changes to bedLayout during app use
  to cause a change to gridData, i.e. dropping/adding beds. */

  /**
   * incomingDataArray -- Grid data in the form of an array
   * bedLayout -- Array of bed names, e.g. ["1", "2", "2B",] etc.
   */
  const updateGridData = useCallback(async (incomingDataArray, bedLayout) => {
    /* If bedLayout parameter is null, just conform bedLayout to the data.
    If bedLayout is non-null but empty, we will use it as such, as this may have
    been intended by setting the bedLayout to no beds. */
    let bl = [];
    if (bedLayout == null) {
      incomingDataArray.forEach((element) => {
        bl.push(element.bed);
      });
    } else {
      bl = bedLayout;
    }

    /* Merge the data with bedLayout array and then sort the data array by bed*/
    try {
      const mergedData = mergeWithBedLayout(incomingDataArray, bl);
      const sortedArrayData = sortByBed(mergedData);
      setGridData(sortedArrayData);
      setBedLayout(bl);
      return sortedArrayData;
    } catch (error) {
      console.error(
        `Error updating grid in GridStateProvider: ${error.message}`
      );
      return false;
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

  /* Create bed census object each time gridData changes */
  useEffect(() => {
    let totalBeds = 0;
    let emptyTotal = 0;
    let emptyBeds = [];
    let teamTotals = [];

    gridData?.forEach((e) => {
      // if the bed has a bed number
      if (e.bed) {
        totalBeds += 1;
        // if the bed is empty
        if (isBedEmpty(e)) {
          emptyTotal += 1;
          emptyBeds.push(e.bed);
        }

        // team number exists
        if (e.teamNumber) {
          const team = e.teamNumber + ""; // cast to String
          const index = teamTotals.findIndex((element) => element.id === team);
          if (index !== -1) {
            teamTotals[index].value = teamTotals[index].value + 1;
          } else {
            teamTotals.push({ id: team, value: 1 });
          }
        }
      }
    });

    setCensus({
      total: totalBeds,
      emptyTotal: emptyTotal,
      emptyBeds: emptyBeds,
      filledTotal: totalBeds - emptyTotal,
      teamTotals: teamTotals,
    });
  }, [gridData]);

  return (
    <GridStateContext.Provider
      value={{ bedLayout, gridData, census, updateGridData }}
    >
      {children}
    </GridStateContext.Provider>
  );
}

export const useGridStateContext = () => useContext(GridStateContext);
