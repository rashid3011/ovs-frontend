import "./App.css";
import { Route, Switch } from "react-router-dom";
import ProtectedRouteVoter from "./Components/ProtectedRouteVoter";
import ProtectedRouteEc from "./Components/ProtectedRouteEc";
import VoterLogin from "./Components/VoterLogin";
import Register from "./Components/Register";
import Home from "./Components/Home";
import NotFound from "./Components/NotFound";
import EcLoginPage from "./Components/EcLogin";
import VoterDashboard from "./Components/VoterDashboard";
import EcDashboard from "./Components/EcDashboard";
import ViewVoterProfile from "./Components/ViewVoterProfile";
import RequestNominationForm from "./Components/RequestNominationForm";
import EcCreateCandidate from "./Components/EcCreateCandidate";
import EcCreateVoter from "./Components/EcCreateVoter";
import EcViewVoters from "./Components/EcViewVoters";
import EcViewCandidates from "./Components/EcViewCandidates";
import EcPendingRequests from "./Components/EcPendingRequests";
import VoterViewResults from "./Components/VoterViewResults";
import EcStartCampaign from "./Components/EcStartCampaign";
import EcStopCampaign from "./Components/EcStopCampaign";
import VoterViewVotes from "./Components/VoterViewVotes";
import Donation from "./Components/Donation";
import AboutUs from "./Components/AboutUs";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/voter-login" component={VoterLogin} />
        <Route exact path="/voter-register" component={Register} />
        <Route exact path="/about-us" component={AboutUs} />
        <ProtectedRouteVoter
          exact
          path="/voter-dashboard"
          component={VoterDashboard}
        />
        <ProtectedRouteVoter exact path="/donation" component={Donation} />
        <ProtectedRouteVoter
          exact
          path="/view-results"
          component={VoterViewResults}
        />
        <ProtectedRouteVoter
          exact
          path="/voter-votes"
          component={VoterViewVotes}
        />
        <ProtectedRouteVoter
          exact
          path="/view-profile"
          component={ViewVoterProfile}
        />
        <ProtectedRouteVoter
          exact
          path="/request-nomination"
          component={RequestNominationForm}
        />
        <Route exact path="/" component={Home} />
        <Route exact path="/ec-login" component={EcLoginPage} />
        <ProtectedRouteEc exact path="/ec-dashboard" component={EcDashboard} />
        <ProtectedRouteEc
          exact
          path="/create-candidate"
          component={EcCreateCandidate}
        />
        <ProtectedRouteEc
          exact
          path="/create-voter"
          component={EcCreateVoter}
        />
        <ProtectedRouteEc exact path="/view-voters" component={EcViewVoters} />
        <ProtectedRouteEc
          exatc
          path="/view-candidates"
          component={EcViewCandidates}
        />
        <ProtectedRouteEc
          exact
          path="/accept-nominations"
          component={EcPendingRequests}
        />
        <ProtectedRouteEc
          exact
          path="/start-campaign"
          component={EcStartCampaign}
        />
        <ProtectedRouteEc
          exact
          path="/stop-campaign"
          component={EcStopCampaign}
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
