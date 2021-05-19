import "./App.css";
import { Router } from "wouter";

import { SettingsProvider } from "./context/Settings";

import Header from "./components/Header";

// Where all of our pages come from
import PageRouter from "./components/PageRouter";

// Firebase
import Firebase from "./components/Firebase/Firebase";
import { config } from "./components/Firebase/credentials";
import AuthStateProvider from "./context/AuthState";
import GridStateProvider from "./context/GridState";

const fb = new Firebase({ ...config });

function App() {
  return (
    <div className="app">
      <SettingsProvider>
        <AuthStateProvider Firebase={fb}>
          <GridStateProvider Firebase={fb}>
            <Router>
              <Header />
              <PageRouter />
            </Router>
          </GridStateProvider>
        </AuthStateProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;
