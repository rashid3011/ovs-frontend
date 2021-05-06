import "./App.css";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import NotFound from "./Components/NotFound";
import ECLoginPage from "./Components/EcLogin";
import VoterDashboard from "./Components/VoterDashboard";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/voter-login" component={LoginPage} />
        <Route exact path="/ec-login" component={ECLoginPage} />
        <Route exact path="/voter-register" component={Register} />
        <Route exact path="/voter-dashboard" component={VoterDashboard} />
        {/*<Route exact path="/view-profile" component={ViewProfile} />*/}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
