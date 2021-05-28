import { React, Component } from "react";
import Loader from "react-loader-spinner";
import CastVotePopup from "../CastVotePopup";
import VoterCommon from "../VoterCommon";
import AuthencticateVoter from "../AuthencticateVoter";
import "./index.css";

const voteDivision = [
  {
    key: "mla",
    value: "MLA",
  },
  {
    key: "mp",
    value: "MP",
  },
  {
    key: "sarpanch",
    value: "Sarpanch",
  },
  {
    key: "zptc",
    value: "ZPTC",
  },
];

class VoterDashboard extends Component {
  state = {
    activeElectionType: "mla",
    mlaDetails: [],
    mpDetails: [],
    zptcDetails: [],
    sarpanchDetails: [],
    partyDetails: [],
    voterDetails: [],
    isFetching: true,
  };

  fetchVoterDetails = async () => {
    const voterDetails = localStorage.getItem("voterDetails");
    const voterId =
      voterDetails === null ? "" : JSON.parse(voterDetails).voterId;
    const url = `https://ovs-backend.herokuapp.com/voters/${voterId}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const { voter } = data;
      localStorage.setItem("voterDetails", JSON.stringify(voter));
      this._mount && this.setState({ voterDetails: voter });
    }
    this._mount && this.getDetails();
  };

  componentDidMount() {
    this._mount = true;
    this._mount && this.fetchVoterDetails();
  }

  componentWillUnmount() {
    this._mount = false;
  }

  toggleNavbar = () => {
    this.setState((prevState) => ({
      isNavbarVisible: !prevState.isNavbarVisible,
    }));
  };

  toggleUserProfile = () => {
    this.setState((prevState) => ({
      isUserProfileVisible: !prevState.isUserProfileVisible,
    }));
  };

  renderLoader = () => {
    return (
      <Loader
        className="pending-loader"
        type="TailSpin"
        width={35}
        height={35}
        color="blue"
      />
    );
  };

  capitalize = (x) => x.slice(0, 1).toUpperCase() + x.slice(1);

  getDetails = async () => {
    const voterDetails = JSON.parse(localStorage.getItem("voterDetails"));
    await this.getMlaDetails(voterDetails);
    await this.getMpDetails(voterDetails);
    await this.getSarpanchDetails(voterDetails);
    await this.getZptcDetails(voterDetails);
    const { mlaDetails } = this.state;
    this.setState({ partyDetails: mlaDetails, isFetching: false });
  };

  getMpDetails = async (voterDetails) => {
    const { district } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/mp/${district}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ mpDetails: candidates });
    }
  };

  getMlaDetails = async (voterDetails) => {
    const { constituency } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/mla/${constituency}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ mlaDetails: candidates });
    }
  };

  getZptcDetails = async (voterDetails) => {
    const { mandal } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/zptc/${mandal}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ zptcDetails: candidates });
    }
  };

  getSarpanchDetails = async (voterDetails) => {
    const { village } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/sarpanch/${village}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ sarpanchDetails: candidates });
    }
  };

  changeElectionType = async (event) => {
    const electionType = event.target.id;
    const { mlaDetails, mpDetails, zptcDetails, sarpanchDetails } = this.state;
    let details;
    if (electionType === "mla") {
      details = mlaDetails;
    } else if (electionType === "mp") {
      details = mpDetails;
    } else if (electionType === "sarpanch") {
      details = sarpanchDetails;
    } else {
      details = zptcDetails;
    }

    this.setState({ activeElectionType: electionType, partyDetails: details });
  };

  renderCastVoteHeader = () => {
    const { activeElectionType, isFetching, isCastingVote } = this.state;
    const headerClass = isFetching || isCastingVote ? "loading-header" : "";
    return (
      <div className={`cast-vote-header-container ${headerClass}`}>
        <ul className="cast-vote-header">
          {voteDivision.map((item) => {
            const { key, value } = item;
            const classActive =
              key === activeElectionType ? "active-election-type" : "";
            return (
              <li
                key={key}
                id={key}
                className={classActive}
                onClick={this.changeElectionType}
              >
                {value}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  renderNoResults = (election) => {
    return (
      <div className="voter-no-results">
        <i className="fas fa-exclamation-triangle"></i>
        <h1>
          No{" "}
          <span style={{ fontWeight: "600", fontSize: "18px" }}>
            {election}
          </span>{" "}
          is found in your location
        </h1>
      </div>
    );
  };

  getPartyImage = (partyName) => {
    switch (partyName.toLowerCase()) {
      case "bjp":
        return "bjp-logo.png";
      case "congress":
        return "congress-logo.png";
      case "aap":
        return "aap-logo.jpg";
      case "trs":
        return "trs-logo.jpeg";
      default:
        return "others-logo.png";
    }
  };

  renderCandidateList = () => {
    const { partyDetails, activeElectionType, isFetching } = this.state;
    return (
      <div className="party-list-container">
        <ul className="party-list">
          {isFetching
            ? this.renderLoader()
            : partyDetails.length === 0
            ? this.renderNoResults(activeElectionType)
            : partyDetails.map((item) => {
                const { candidateId, partyName, voterInfo } = item;
                const { firstName, lastName } = voterInfo;
                const imageUrl = this.getPartyImage(partyName);
                return (
                  <li
                    className="party-list-li"
                    key={`${candidateId}-${activeElectionType}`}
                  >
                    <img
                      src={imageUrl}
                      alt={partyName}
                      className="party-logo"
                    />
                    <p className="candidate-name">{`${this.capitalize(
                      firstName
                    )} ${this.capitalize(lastName)}`}</p>
                    <p className="party-name">{this.capitalize(partyName)}</p>
                    <CastVotePopup details={item} />
                  </li>
                );
              })}
        </ul>
      </div>
    );
  };

  renderComponent = () => {
    return (
      <div className="dash-bg">
        <VoterCommon />
        <h1 className="quote">
          The Ballot
          <br /> is stronger than
          <br /> The Bullet.
        </h1>
        <div className="cast-vote-outer-container">
          <div className="cast-vote-container">
            {this.renderCastVoteHeader()}
            {this.renderCandidateList()}
          </div>
        </div>
      </div>
    );
  };

  render() {
    return this.renderComponent();
  }
}

export default VoterDashboard;
