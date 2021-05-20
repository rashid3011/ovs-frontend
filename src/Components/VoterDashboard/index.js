import { React, Component } from "react";
import Loader from "react-loader-spinner";
import VoterSidebar from "../VoterSidebar";
import Dashboardheader from "../Dashboardheader";
import "./index.css";
import CastVotePopup from "../CastVotePopup";
import AuthencticateVoter from "../AuthencticateVoter";

const navLinks = [
  {
    key: "view-profile",
    value: "Profile",
    icon: "user",
  },
  {
    key: "view-results",
    value: "View Results",
    icon: "poll",
  },
  {
    key: "request-nomination",
    value: "Request Nomination",
    icon: "edit",
  },
  {
    key: "delete-account",
    value: "Delete Account",
    icon: "trash",
  },
];

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
    isNavbarVisible: false,
    isUserProfileVisible: false,
    activeElectionType: "mla",
    mlaDetails: [],
    mpDetails: [],
    zptcDetails: [],
    sarpanchDetails: [],
    partyDetails: [],
    voterDetails: [],
    isFetching: true,
    isDeletingVoter: false,
    castVoteErrorMessage: "",
  };

  fetchVoterDetails = async () => {
    const voterDetails = localStorage.getItem("voterDetails");
    const voterId =
      voterDetails !== "undefined" ? JSON.parse(voterDetails).voterId : "";
    const url = `https://ovs-backend.herokuapp.com/voters/${voterId}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.status === 200) {
      const { voter } = await response.json();
      localStorage.setItem("voterDetails", JSON.stringify(voter));
      this._mount && this.setState({ voterDetails: voter });
    } else {
      this._mount && this.setState({ voterDetails: [] });
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

  deleteVoter = async (item) => {
    const { voterDetails } = this.state;
    const { voterId } = voterDetails;
    const url = " https://ovs-backend.herokuapp.com/voters";
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify({ voterId: voterId }),
    };
    this.setState({ isDeletingVoter: true });
    await fetch(url, options);
    AuthencticateVoter.logout(this.props.history);
  };

  capitalize = (x) => x.slice(0, 1).toUpperCase() + x.slice(1);

  renderDeleteConfirmation = (item, close) => {
    const { voterId, firstName, lastName } = item;
    return (
      <div className="delete-confirmation-container">
        <h1>Voter Details</h1>
        <ul className="popup-details">
          <div className="popup-details-left">
            <p>Voter ID</p>
            <p>First Name</p>
            <p>Last Name</p>
          </div>
          <div className="popup-details-center">
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div className="popup-details-right">
            <p>{voterId !== undefined ? this.capitalize(voterId) : voterId}</p>
            <p>
              {firstName !== undefined ? this.capitalize(firstName) : firstName}
            </p>
            <p>
              {lastName !== undefined ? this.capitalize(lastName) : lastName}
            </p>
          </div>
        </ul>
        <p className="message">
          *Are you sure you want to delete voter-{voterId} <br /> Once deleted
          cannot be restored
        </p>
        <div className="confirm-buttons-container">
          <button
            className="delete"
            onClick={() => {
              this.deleteVoter(item);
            }}
          >
            Delete Voter
          </button>
          <button className="cancel" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  renderDeleteConfirmed = () => {
    return (
      <div className="confirmed-image-container">
        <img
          src="confirmed.gif"
          alt="confirmed"
          className="confirmed-image"
        ></img>
      </div>
    );
  };

  getDetails = async () => {
    await this.getMlaDetails();
    await this.getMpDetails();
    await this.getSarpanchDetails();
    await this.getZptcDetails();
    const { mlaDetails } = this.state;
    this.setState({ partyDetails: mlaDetails, isFetching: false });
  };

  getMpDetails = async () => {
    const voterDetails = localStorage.getItem("voterDetails");
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
    if (response.status !== 404) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ mpDetails: candidates });
    }
  };

  getMlaDetails = async () => {
    const voterDetails = localStorage.getItem("voterDetails");
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
    if (response.status !== 404) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ mlaDetails: candidates });
    }
  };

  getZptcDetails = async () => {
    const voterDetails = localStorage.getItem("voterDetails");
    const { mandal } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/mp/${mandal}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.status !== 404) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ zptcDetails: candidates });
    }
  };

  getSarpanchDetails = async () => {
    const voterDetails = localStorage.getItem("voterDetails");
    const { village } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/mp/${village}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.status !== 404) {
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
      details = zptcDetails;
    } else {
      details = sarpanchDetails;
    }

    this.setState({ activeElectionType: electionType, partyDetails: details });
  };

  logout = () => {
    AuthencticateVoter.logout(this.props.history);
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
      <div className="voter-no-results no-results">
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
        return "https://i.ibb.co/FVww8C7/aap.jpg";
      default:
        return "https://www.google.com/url?sa=i&url=http%3A%2F%2Fwww.pngall.com%2Fprofile-png%2Fdownload%2F51607&psig=AOvVaw3iN0t-L4oAu8PP9pRBuoQe&ust=1621169776988000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCPj4kZzey_ACFQAAAAAdAAAAABAD";
    }
  };

  setCastVoteError = (message) => {
    this.setState({ castVoteErrorMessage: message });
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
                    <CastVotePopup
                      details={item}
                      setErrorMessage={this.setCastVoteError}
                    />
                  </li>
                );
              })}
        </ul>
      </div>
    );
  };

  render() {
    const {
      isNavbarVisible,
      isUserProfileVisible,
      voterDetails,
      isDeletingVoter,
      castVoteErrorMessage,
    } = this.state;
    const { firstName } = JSON.parse(localStorage.getItem("voterDetails"));
    console.log(firstName);
    const isLoggedIn = AuthencticateVoter.authencticate();
    return isLoggedIn !== true ? (
      isLoggedIn
    ) : (
      <div className="dash-bg">
        <Dashboardheader
          isNavbarVisible={isNavbarVisible}
          isProfileVisible={isUserProfileVisible}
          name={firstName === undefined ? "" : firstName}
          logout={this.logout}
          toggleProfile={this.toggleUserProfile}
          toggleNavbar={this.toggleNavbar}
        />
        <VoterSidebar
          navLinks={navLinks}
          isNavbarVisible={isNavbarVisible}
          toggleNavbar={this.toggleNavbar}
          isDeletingVoter={isDeletingVoter}
          renderDeleteConfirmed={this.renderDeleteConfirmed}
          renderDeleteConfirmation={this.renderDeleteConfirmation}
          details={voterDetails}
        />
        <h1 className="quote">
          The Ballot
          <br /> is stronger than
          <br /> The Bullet.
        </h1>
        <p className="cast-vote-error">{castVoteErrorMessage}</p>
        <div className="cast-vote-outer-container">
          <div className="cast-vote-container">
            {this.renderCastVoteHeader()}
            {this.renderCandidateList()}
          </div>
        </div>
      </div>
    );
  }
}

export default VoterDashboard;
