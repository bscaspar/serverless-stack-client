import React from "react";
import { Route, Switch } from "react-router-dom";

import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import ResetPassword from "./containers/ResetPassword";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import Settings from "./containers/Settings";
import ChangePassword from "./containers/ChangePassword";
import ChangeEmail from "./containers/ChangeEmail";
import NotFound from "./containers/NotFound";

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={Login}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/signup"
      exact
      component={Signup}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/login/reset"
      exact
      component={ResetPassword}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/new"
      exact
      component={NewNote}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/:id"
      exact
      component={Notes}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings"
      exact
      component={Settings}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings/password"
      exact
      component={ChangePassword}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings/email"
      exact
      component={ChangeEmail}
      props={childProps}
    />

    {/* Catch all Route (404) */}
    <Route component={NotFound} />
  </Switch>
);
