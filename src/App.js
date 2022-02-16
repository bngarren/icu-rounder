import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

// Theme
import { ThemeProvider } from "@mui/material/styles";
import theme from "./context/Theme";

// Settings
import { SettingsProvider } from "./context/Settings";

// Components
import { Header, Footer, PageRouter } from "./components";

// Routing
import { BrowserRouter } from "react-router-dom";

// Firebase
import { Firebase } from "./api/Firebase";
import { config } from "./api/credentials";
import AuthStateProvider from "./context/AuthState";
import GridStateProvider from "./context/GridState";

const fb = new Firebase({ ...config });

function App() {
  return (
    <div className="app">
      <SettingsProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthStateProvider Firebase={fb}>
            <GridStateProvider Firebase={fb}>
              <BrowserRouter>
                <Container maxWidth="xl">
                  <Header />
                  <main>
                    <PageRouter />
                  </main>
                </Container>
                <Footer />
              </BrowserRouter>
            </GridStateProvider>
          </AuthStateProvider>
        </ThemeProvider>
      </SettingsProvider>
    </div>
  );
}

export default App;
