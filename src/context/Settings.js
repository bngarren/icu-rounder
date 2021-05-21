import { createContext, useReducer, useContext, useEffect } from "react";

const SettingsContext = createContext();

const INITIAL_STATE = {
  document_cols_per_page: 4,
  document_title: "",
  bedLayout: Array.from(new Array(30), (x, i) => i + 1), // default 30 bed unit
};

const settingsReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, INITIAL_STATE);

  useEffect(() => {
    const loadData = () => {
      const data = localStorage.getItem("settings");

      dispatch({
        type: "UPDATE",
        payload: JSON.parse(data),
      });
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = () => {
      const dataToSave = JSON.stringify(state);
      localStorage.setItem("settings", dataToSave);
      console.log(`Saved settings to localStorage: ${dataToSave}`);
    };
    if (state != null) saveData();
  }, [state]);

  const value = { settings: state, dispatchSettings: dispatch };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSettings must be consumed within a SettingsProvider component."
    );
  }
  return context;
};

export { SettingsProvider, useSettings };
