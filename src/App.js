import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

// Theme
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";

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
import { Firebase } from "./components/Firebase/Firebase";
import { config } from "./components/Firebase/credentials";
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
