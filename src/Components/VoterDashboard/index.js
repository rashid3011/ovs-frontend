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
        return "https://i.ibb.co/HCfGQtp/bjp-logo-1-1-removebg-preview.png";
      case "congress":
        return "https://i.ibb.co/zHrLkfF/congress.png";
      case "aap":
        return "https://www.patnadaily.com/images/stories/blog/aap_logo.jpg";
      case "trs":
        return "data:image/jpeg;base64,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";
      default:
        return "https://mpng.subpng.com/20180411/rzw/kisspng-user-profile-computer-icons-user-interface-mystique-5aceb0245aa097.2885333015234949483712.jpg";
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
