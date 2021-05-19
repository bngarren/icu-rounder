import { createContext, useContext, useState, useEffect } from "react";

const GridStateContext = createContext({
  gridData: "",
});

export default function GridStateProvider({ children, Firebase }) {
  const [gridData, setGridData] = useState({
    gridData: "",
  });

  const saveGridToDb = async (userId, data, callback, onError) => {
    const { bed } = data;
    try {
      if (!bed) {
        throw new Error("Bed number required to save data.");
      } else if (!userId) {
        throw new Error("UserId required to save data.");
      }

      await Firebase.db.runTransaction(async (t) => {
        // Get this user's doc in "grids" collection, or
        // create a new doc
        const ref_gridsDoc = Firebase.db.collection("grids").doc(userId);

        await t.update(ref_gridsDoc, {
          ...data,
        });
      });

      callback();
    } catch (error) {
      onError && onError(error);
    }
  };

  useEffect(() => {
    let unsubscribe = Firebase.db
      .collection("grids")
      .doc("X8v2hBludXOJr1UMQiur")
      .onSnapshot((doc) => {
        console.log(`Current grid from firestore = ${doc.data()}`);
        setGridData(doc.data());
      });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  return (
    <GridStateContext.Provider value={{ gridData, saveGridToDb }}>
      {children}
    </GridStateContext.Provider>
  );
}

export const useGridStateContext = () => useContext(GridStateContext);
