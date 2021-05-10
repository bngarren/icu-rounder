import { Switch, Route, Router } from "wouter";
import HomePage from "../../pages/HomePage";
import UpdatePage from "../../pages/UpdatePage";
import DocumentPage from "../../pages/DocumentPage";

const PageRouter = () => (
  <Switch>
    <Route path="/" component={HomePage} />
    <Route path="/update" component={UpdatePage} />
    <Route path="/document" component={DocumentPage} />
  </Switch>
);

export default PageRouter;
