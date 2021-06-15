import { Switch, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import UpdatePage from "../../pages/UpdatePage";
import SettingsPage from "../../pages/SettingsPage/index.js";
import LoginPage from "../../pages/LoginPage";
import DocumentPage from "../../pages/DocumentPage";

// Authentication
import { useAuthStateContext } from "../../context/AuthState";

const PageRouter = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <PrivateRoute path="/update">
        <UpdatePage />
      </PrivateRoute>
      <PrivateRoute path="/settings">
        <SettingsPage />
      </PrivateRoute>
      <PrivateRoute path="/document">
        <DocumentPage />
      </PrivateRoute>
      <Route path="/" component={HomePage} />
      <Route>404, Page not found!</Route>
    </Switch>
  );
};

/* Wraps around a Route component giving us the ability to display
the route only if authenticate, otherwise redirects to Login page
https://ui.dev/react-router-v5-protected-routes-authentication/
 */
const PrivateRoute = ({ children, ...rest }) => {
  const { userIsLoggedIn } = useAuthStateContext();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        userIsLoggedIn ? children : <>You must log in</>
      }
    />
  );
};

export default PageRouter;
