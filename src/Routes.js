import React from "react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
//import LoadingSpinner from "./components/LoadingSpinner";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Glyphicon } from "react-bootstrap";

// function myLoadable(opts) {
//   return Loadable(
//     Object.assign(
//       {
//         loading: LoadingSpinner,
//         delay: 2000
//       },
//       opts
//     )
//   );
// }

const LoadingSpinner = () => <Glyphicon glyph="refresh" className="spinning" />;

const AsyncHome = Loadable({
  loader: () => import("./containers/Home"),
  loading: LoadingSpinner,
  delay: 500
});
const AsyncLogin = Loadable({
  loader: () => import("./containers/Login"),
  loading: LoadingSpinner,
  delay: 500
});
const AsyncSignup = Loadable({
  loader: () => import("./containers/Signup"),
  loading: LoadingSpinner
});
const AsyncResetPassword = Loadable({
  loader: () => import("./containers/ResetPassword"),
  loading: LoadingSpinner
});
const AsyncNewNote = Loadable({
  loader: () => import("./containers/NewNote"),
  loading: LoadingSpinner
});
const AsyncNotes = Loadable({
  loader: () => import("./containers/Notes"),
  loading: LoadingSpinner
});
const AsyncSettings = Loadable({
  loader: () => import("./containers/Settings"),
  loading: LoadingSpinner
});
const AsyncChangePassword = Loadable({
  loader: () => import("./containers/ChangePassword"),
  loading: LoadingSpinner
});
const AsyncChangeEmail = Loadable({
  loader: () => import("./containers/ChangeEmail"),
  loading: LoadingSpinner
});
const AsyncNotFound = Loadable({
  loader: () => import("./containers/NotFound"),
  loading: LoadingSpinner
});

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={AsyncHome} props={childProps} />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={AsyncLogin}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/signup"
      exact
      component={AsyncSignup}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/login/reset"
      exact
      component={AsyncResetPassword}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/new"
      exact
      component={AsyncNewNote}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/notes/:id"
      exact
      component={AsyncNotes}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings"
      exact
      component={AsyncSettings}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings/password"
      exact
      component={AsyncChangePassword}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings/email"
      exact
      component={AsyncChangeEmail}
      props={childProps}
    />

    {/* Catch all Route (404) */}
    <Route component={AsyncNotFound} />
  </Switch>
);
