import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import UpdatePage from "../../pages/UpdatePage";
import SettingsPage from "../../pages/SettingsPage/index.js";
import LoginPage from "../../pages/LoginPage";
import DocumentPage from "../../pages/DocumentPage";

// Authentication
import { useAuthStateContext } from "../../context/AuthState";

const PageRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* The following routes are "protected", i.e. logged in only */}
      <Route
        path="/update"
        element={
          <RequireAuth>
            <UpdatePage />
          </RequireAuth>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/document"
        element={
          <RequireAuth>
            <DocumentPage />
          </RequireAuth>
        }
      />

      {/* The no match route, i.e. 404 */}
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  );
};

/* If user is logged in, will show the "protected" child component,
if not, will redirect to the LoginPage */
const RequireAuth = ({ children }) => {
  const { userIsLoggedIn } = useAuthStateContext();
  const location = useLocation();

  if (!userIsLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PageRouter;
