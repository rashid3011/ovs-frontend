import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthenticateVoter from "../AuthenticateVoter";

function ProtectedRouteVoter(props) {
  const isLogged = AuthenticateVoter.authenticate();
  return isLogged ? <Route {...props} /> : <Redirect to="/voter-login" />;
}

export default ProtectedRouteVoter;
