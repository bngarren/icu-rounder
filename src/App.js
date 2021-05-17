import "./App.css";
import { Router } from "wouter";

import { SettingsProvider } from "./context/Settings";

import Header from "./components/Header";

// Where all of our pages come from
import PageRouter from "./components/PageRouter";

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="app">
          <Header />
          <PageRouter />
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
