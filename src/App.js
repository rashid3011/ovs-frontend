import "./App.css";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import NotFound from "./Components/NotFound";
import ECLoginPage from "./Components/EcLogin";
import VoterDashboard from "./Components/VoterDashboard";
import EcDashboard from "./Components/EcDashboard";
import ViewVoterProfile from "./Components/ViewVoterDetails";
import RequestNominationForm from "./Components/RequestNominationForm";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/voter-login" component={LoginPage} />
        <Route exact path="/ec-login" component={ECLoginPage} />
        <Route exact path="/voter-register" component={Register} />
        <Route exact path="/voter-dashboard" component={VoterDashboard} />
        <Route exact path="/ec-dashboard" component={EcDashboard} />
        <Route exact path="/view-profile" component={ViewVoterProfile} />
        <Route
          exact
          path="/request-nomination"
          component={RequestNominationForm}
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
