import "./App.css";

// Theme
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./Theme";

// Settings
import { SettingsProvider } from "./context/Settings";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Where all of our pages come from
import { BrowserRouter as Router } from "react-router-dom";
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
        <ThemeProvider theme={theme}>
          <AuthStateProvider Firebase={fb}>
            <GridStateProvider Firebase={fb}>
              <Router>
                <Header />
                <PageRouter />
                <Footer />
              </Router>
            </GridStateProvider>
          </AuthStateProvider>
        </ThemeProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;
