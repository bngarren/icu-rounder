import React, { Suspense, lazy } from 'react';
import { Switch, Route} from "wouter";
import HomePage from "../../pages/HomePage";
import UpdatePage from "../../pages/UpdatePage";
//import DocumentPage from "../../pages/DocumentPage";

const DocumentPage = lazy(() => import('../../pages/DocumentPage'));
const Loading = () => <div>Loading route...</div>;

const PageRouter = () => (
  <Switch>
    <Route path="/" component={HomePage} />
    <Route path="/update" component={UpdatePage} />

    <Suspense fallback={Loading()}>
      <Route path="/document" component={DocumentPage} />
    </Suspense>
  </Switch>
);

export default PageRouter;
