import "./App.css";

// Theme
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { theme } from "./Theme";

// Settings
import { SettingsProvider } from "./context/Settings";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Where all of our pages come from
// ! Using HashRouter instead of BrowserRouter to work with GitHub pages deployment
import { BrowserRouter } from "react-router-dom";
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
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <AuthStateProvider Firebase={fb}>
              <GridStateProvider Firebase={fb}>
                <BrowserRouter>
                  <Header />
                  <PageRouter />
                  <Footer />
                </BrowserRouter>
              </GridStateProvider>
            </AuthStateProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;
