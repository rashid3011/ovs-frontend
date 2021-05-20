import "./App.css";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import NotFound from "./Components/NotFound";
import ECLoginPage from "./Components/EcLogin";
import VoterDashboard from "./Components/VoterDashboard";
import EcDashboard from "./Components/EcDashboard";
import ViewVoterProfile from "./Components/ViewVoterProfile";
import RequestNominationForm from "./Components/RequestNominationForm";
import EcCreateCandidate from "./Components/EcCreateCandidate";
import EcCreateVoter from "./Components/EcCreateVoter";
import EcViewVoters from "./Components/EcViewVoters";
import EcViewCandidates from "./Components/EcViewCandidates";
import ViewPendingRequests from "./Components/ViewPendingRequests";
import VoterViewResults from "./Components/VoterViewResults";

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
        <Route exact path="/create-candidate" component={EcCreateCandidate} />
        <Route exact path="/create-voter" component={EcCreateVoter} />
        <Route exact path="/view-voters" component={EcViewVoters} />
        <Route exatc path="/view-candidates" component={EcViewCandidates} />
        <Route
          exact
          path="/accept-nominations"
          component={ViewPendingRequests}
        />
        <Route exact path="/view-results" component={VoterViewResults} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
