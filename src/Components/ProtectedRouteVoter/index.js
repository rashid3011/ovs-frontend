import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthencticateVoter from "../AuthencticateVoter";

function ProtectedRouteVoter(props) {
  const isLogged = AuthencticateVoter.authenticate();
  return isLogged ? <Route {...props} /> : <Redirect to="/voter-login" />;
}

export default ProtectedRouteVoter;
