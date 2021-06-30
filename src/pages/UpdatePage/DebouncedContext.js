import { createContext, useRef, useCallback, useContext, useMemo } from "react";

const DebouncedContext = createContext();

const DebouncedContextProvider = ({ children }) => {
  /* Keeps a reference to array of debounced funtions being used */
  const debouncedFunctions = useRef([]);

  /* Iterate through each debounced function and flush() it to call immediately without
  waiting on timeout period */
  const flushAll = useCallback(() => {
    if (debouncedFunctions?.current.length > 0) {
      debouncedFunctions.current.forEach((element) => {
        try {
          element.function.flush();
        } catch (err) {
          console.error(err);
        }
      });
    }
  }, []);

  /* Add a new debounced function to the state */
  const add = useCallback((f, id = "generic") => {
    const index = debouncedFunctions.current.findIndex(
      (element) => element.id === id
    );
    if (index === -1) {
      debouncedFunctions.current = [
        { id: id, function: f },
        ...debouncedFunctions.current,
      ];
    }
  }, []);

  /* Remove debounced function from state */
  const remove = useCallback((id) => {
    const index = debouncedFunctions?.current.findIndex(
      (element) => element.id === id
    );
    if (index !== -1) {
      debouncedFunctions.current.splice(index, 1);
    }
  }, []);

  /* The object to be passed as the context value */
  const value = useMemo(
    () => ({
      addDebouncedFunction: add,
      removeDebouncedFunction: remove,
      flushAll: flushAll,
    }),
    [add, flushAll, remove]
  );

  return (
    <DebouncedContext.Provider value={value}>
      {children}
    </DebouncedContext.Provider>
  );
};

/* Helper hook to use this context */
const useDebouncedContext = () => {
  const context = useContext(DebouncedContext);
  return context;
};

export { DebouncedContextProvider, useDebouncedContext };
