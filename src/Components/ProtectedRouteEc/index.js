import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthencticateEc from "../AuthenticateEc";

function ProtectedRouteEc(props) {
  const isLogged = AuthencticateEc.authenticate();
  return isLogged ? <Route {...props} /> : <Redirect to="/ec-login" />;
}

export default ProtectedRouteEc;
