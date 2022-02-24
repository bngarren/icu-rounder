import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Utility
import { sortByLocation, isGridDataElementEmpty } from "../utils";
import { v4 as uuidv4 } from "uuid";

/* Takes an array of gridDataElements (i.e. the "beds" as referred to previously)
  and merges with an "locationLayout" which is the array of available locations or "bedspaces". */
const mergeWithLocationLayout = (gridData, locationLayout) => {
  if (typeof gridData === "undefined") {
    throw new Error(
      `Cannot mergeWithLocationLayout, invalid input gridData array.`
    );
  }
  if (locationLayout == null || locationLayout.length === 0) {
    console.log(
      "Invalid or empty locationLayout passed to mergeWithLocationLayout."
    );
    locationLayout = "";
  }

  /* resultGridDataArray will begin the formation of our new gridData array */
  let resultGridDataArray = [];
  if (Array.isArray(locationLayout)) {
    locationLayout.forEach((location, index) => {
      /* For each location declared in locationLayout, at least make a
      gridDataElement object with a "id" property having a unique value and
      the location */
      resultGridDataArray[index] = { id: uuidv4(), location: location };

      /* If there is also passed in gridData (not just an elementLayout),
      let's check to see if there is data for the gridDataElement at
      this location that we need to add */
      if (gridData?.length > 0) {
        gridData.forEach((gde) => {
          /* If there is a gridDataElement within the gridData array
          pertaining to the current element within elementLayout, let's add this data */
          if (gde.location === location) {
            resultGridDataArray[index] = gde;
          }
        });
      }
    });
  }
  return resultGridDataArray;
};

const GridStateContext = createContext();

export default function GridStateProvider({ children }) {
  const [locationLayout, setLocationLayout] = useState();
  const [gridData, setGridData] = useState();
  const [census, setCensus] = useState();

  /* Takes input data (array of gridDataElements) and stores it in state as gridData.
  If a locationLayout parameter is passed, the data will conform to this. If locationLayout is null,
  the locationLayout will conform to the passed data. This allows imported data to
  have a locationLayout conformed to it, but also allows changes to locationLayout during app use
  to cause a change to gridData, i.e. dropping/adding locations. */

  /**
   * incomingDataArray -- Grid data in the form of an array
   * locationLayout -- Array of location names, e.g. ["1", "2", "2B",] etc.
   */
  const updateGridData = useCallback(
    async (_incomingDataArray, incomingLocationLayout) => {
      /* First we handle the case of bad argument data */
      let incomingDataArray = [];
      if (_incomingDataArray != null && Array.isArray(_incomingDataArray)) {
        incomingDataArray = [..._incomingDataArray];
      } else {
        console.warn(
          "updateGridData is being sent bad data! ",
          _incomingDataArray
        );
      }

      /* If locationLayout parameter is null, just conform locationLayout to the incoming data.
    However, if locationLayout is non-null but empty, ie. [], we will use it as such,
    as this may have been intended by setting the locationLayout to empty in order
    to clear the grid data. */
      let finalLocationLayout = [];
      if (incomingLocationLayout == null && incomingDataArray.length !== 0) {
        incomingDataArray.forEach((gde) => {
          // gde = gridDataElement
          finalLocationLayout.push(gde.location);
        });
      } else {
        finalLocationLayout = incomingLocationLayout || [];
      }

      /* Merge the incoming data with locationLayout array and then sort the data array by location*/
      try {
        const mergedData = mergeWithLocationLayout(
          incomingDataArray,
          finalLocationLayout
        );
        const sortedArrayData = sortByLocation(mergedData);
        setGridData(sortedArrayData);
        setLocationLayout(finalLocationLayout);
        return sortedArrayData;
      } catch (error) {
        console.error(
          `Error updating grid in GridStateProvider: ${error.message}`
        );
        return false;
      }
    },
    []
  );

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

  /* Create census object each time gridData array changes */
  useEffect(() => {
    let totalElements = 0;
    let emptyTotal = 0;
    let emptyElements = [];
    let teamTotals = [];

    gridData?.forEach((e) => {
      // if the gridDataElement has an id
      if (e.id) {
        totalElements += 1;
        // if the gridDataElement is empty
        if (isGridDataElementEmpty(e)) {
          emptyTotal += 1;
          emptyElements.push(e.location);
        }

        // team exists
        if (e.team) {
          const team = e.team + ""; // cast to String
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
      total: totalElements,
      emptyTotal: emptyTotal,
      emptyElements: emptyElements,
      filledTotal: totalElements - emptyTotal,
      teamTotals: teamTotals,
    });
  }, [gridData]);

  return (
    <GridStateContext.Provider
      value={{
        locationLayout,
        gridData,
        census,
        updateGridData,
      }}
    >
      {children}
    </GridStateContext.Provider>
  );
}

export const useGridStateContext = () => useContext(GridStateContext);
