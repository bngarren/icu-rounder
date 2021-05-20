import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useSettings } from "../context/Settings";
import { useAuthStateContext } from "../context/AuthState";

// Utility
import { sortByBed } from "../utils/Utility";
import { v4 as uuidv4 } from "uuid"; // unique id generator

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

const BED_LAYOUT = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  "9b",
  10,
  11,
  12,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
];

const INITIAL_STATE = {
  gridData: undefined,
  updateGridData: (f) => f,
};

const GridStateContext = createContext(INITIAL_STATE);

export default function GridStateProvider({ children, Firebase }) {
  const { authState } = useAuthStateContext();
  const [gridData, setGridData] = useState();
  const [gridDataJson, setGridDataJson] = useState();
  const [gridDataDeindentified, setGridDataDeidentified] = useState();
  const [gridId, setGridId] = useState();
  const { context: settings } = useSettings;

  const setGridDataInStorage = useCallback(
    (localStorageData, firestoreData) => {
      try {
        let userId = authState?.user?.uid;
        if (!userId) {
          throw new Error(`No userId`);
        }

        let batch = Firebase.db.batch();
        let docRef = Firebase.db.collection("grids").doc(userId);
        const id = uuidv4();
        batch.set(docRef, {
          id: id,
          data: { ...firestoreData },
        });
        batch.commit().then(() => {
          localStorage.setItem(
            "gridData",
            JSON.stringify({ id: id, data: localStorageData })
          );
        });
      } catch (error) {
        console.log(`Error setting grid data in firestore: ${error.message}`);
      }
    },
    [Firebase, authState.user]
  );

  /* Recives JSON object data, converts to bed-ordered array,
  merges with BED_LAYOUT, saves a deidentified version to localStorage,
  and sets result as gridData */
  const updateGridData = useCallback(
    (data) => {
      console.log("here");
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
        const mergedData = mergeWithBedLayout(arr, BED_LAYOUT); // ! should be from settings
        const sortedArrayData = sortByBed(mergedData);
        setGridData(sortedArrayData);
        setGridDataJson(getJsonObjectFromSortedArray(sortedArrayData));

        /* Deidentified data will be stored in localStorage */
        const { result: deidentified, removedData } =
          getDeidentifiedData(sortedArrayData);

        const dataForLocalStorage = deidentified;

        // set grid data in both localStorage and Firestore
        setGridDataInStorage(dataForLocalStorage, removedData);
        setGridDataDeidentified(deidentified);
      } catch (error) {
        console.error(
          `Error updating grid in GridStateProvider: ${error.message}`
        );
      }
    },
    [setGridDataInStorage]
  );

  const getGridDataFromDb = useCallback(async () => {
    try {
      let userId = authState?.user?.uid;
      if (!userId) {
        throw new Error(`No userId`);
      }
      let docRef = Firebase.db.collection("grids").doc(userId);
      let res = await docRef.get();
      if (res.exists) {
        return res.data();
      } else {
        console.log(
          `Did not find grids doc in Firestore for this userId: ${userId}`
        );
      }
    } catch (error) {
      console.log(
        `Aborted Firestore query for getGridDataFromDb: ${error.message}`
      );
    }
  }, [Firebase, authState.user]);

  /* Try to combine deidentified data in localStorage with data
  from Firestore, or pass a null parameter which will generate an empty grid */
  useEffect(() => {
    const getCombinedData = async () => {
      const localStorageData = JSON.parse(localStorage.getItem("gridData"));
      if (localStorageData && typeof localStorageData !== "undefined") {
        let doc = await getGridDataFromDb().then((res) => {
          return res;
        });
        if (doc?.id === localStorageData.id) {
          // there is a matching grid!

          // ! WORKING RIGHT HERE TO COMBINE DATA

          console.log(
            `We have matching grid data in localStorage and Firestore!`
          );
          return combinedData;
        }
      }
    };
    getCombinedData().then((cd) => {
      updateGridData(cd);
    });
  }, [updateGridData, getGridDataFromDb]); //updateGridData, getGridDataFromDb are memoized

  const getDeidentifiedData = (arrayData) => {
    let removedData = [];
    const result = arrayData.map((value) => {
      const { lastName, firstName, ...keep } = value;
      removedData.push({
        bed: value.bed,
        lastName: lastName || "",
        firstName: firstName || "",
      });
      return { ...keep };
    });
    return { result, removedData };
  };

  return (
    <GridStateContext.Provider
      value={{ gridData, gridDataJson, gridDataDeindentified, updateGridData }}
    >
      {children}
    </GridStateContext.Provider>
  );
}

export const useGridStateContext = () => useContext(GridStateContext);
