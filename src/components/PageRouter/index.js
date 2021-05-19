import { Switch, Route } from "wouter";
import HomePage from "../../pages/HomePage";
import UpdatePage from "../../pages/UpdatePage";
import SettingsPage from "../../pages/SettingsPage";
import LoginPage from "../../pages/LoginPage";
import DocumentPage from "../../pages/DocumentPage";

const PageRouter = () => (
  <Switch>
    <Route path="/" component={HomePage} />
    <Route path="/update" component={UpdatePage} />
    <Route path="/settings" component={SettingsPage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/document" component={DocumentPage} />
  </Switch>
);

export default PageRouter;
