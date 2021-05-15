import { React, Component } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import VoterSidebar from "../VoterSidebar";
import Dashboardheader from "../Dashboardheader";
import "./index.css";

const navLinks = [
  {
    key: "view-profile",
    value: "Profile",
  },
  {
    key: "view-results",
    value: "View Results",
  },
  {
    key: "view-candidates",
    value: "View Candidates",
  },
  {
    key: "request-nomination",
    value: "Request Nomination",
  },
  {
    key: "delete-account",
    value: "Delete Account",
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
  };

  fetchVoterDetails = async () => {
    const { voterId } = JSON.parse(localStorage.getItem("voterDetails"));
    const url = `https://ovs-backend.herokuapp.com/voters/${voterId}`;
    const response = await fetch(url);
    const { voter } = await response.json();
    localStorage.setItem("voterDetails", JSON.stringify(voter));
    this.setState({ voterDetails: voter });
    this.getDetails();
  };

  componentDidMount() {
    this.fetchVoterDetails();
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

  deleteUser = async (item) => {
    const { history } = this.props;
    const { voterId } = item;
    const url = " https://ovs-backend.herokuapp.com/voters";
    const options = {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ voterId: voterId }),
    };

    this.setState({ isDeletingVoter: true });
    await fetch(url, options);
    Cookies.remove("token");
    history.push("/");
  };

  renderDeleteConfirmation = (item, close) => {
    const { voterId, firstName, lastName } = item;
    return (
      <div className="delete-confirmation-container">
        <h1>Your Details</h1>
        <ul>
          <p>Voter ID : {voterId}</p>
          <p>First Name : {firstName}</p>
          <p>Last Name : {lastName}</p>
        </ul>
        <p className="message">
          *Are you sure you want to delete your account <br /> Once deleted
          cannot be restored
        </p>
        <div className="confirm-buttons-container">
          <button
            className="delete"
            onClick={() => {
              this.deleteUser(item);
            }}
          >
            Delete User
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

  getDetails = () => {
    this.getMlaDetails();
    this.getMpDetails();
    this.getSarpanchDetails();
    this.getZptcDetails();
    this.setState({ isFetching: false });
  };

  getMpDetails = async () => {
    const { voterDetails } = this.state;
    const { district } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/mp/${district}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    if (response.status !== 404) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ mpDetails: candidates });
    }
  };

  getMlaDetails = async () => {
    const { voterDetails } = this.state;
    const { constituency } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/mla/${constituency}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    if (response.status !== 404) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ mlaDetails: candidates });
    }
  };

  getZptcDetails = async () => {
    const { voterDetails } = this.state;
    const { mandal } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/mp/${mandal}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    if (response.status !== 404) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({ zptcDetails: candidates });
    }
  };

  getSarpanchDetails = async () => {
    const { voterDetails } = this.state;
    const { village } = voterDetails;
    const url = `https://ovs-backend.herokuapp.com/candidates/mp/${village}`;
    const options = {
      method: "GET",
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
    Cookies.remove("token");
    const { history } = this.props;
    history.replace("/voter-login");
  };

  renderCastVoteHeader = () => {
    const { activeElectionType } = this.state;
    return (
      <div className="cast-vote-header-container">
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
      <div className="no-results">
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
                    <p className="candidate-name">{`${firstName} ${lastName}`}</p>
                    <p className="party-name">{partyName}</p>
                    <button className="cast-vote-button">Vote</button>
                  </li>
                );
              })}
        </ul>
      </div>
    );
  };

  render() {
    if (Cookies.get("token") === undefined) {
      return <Redirect to="/voter-login" />;
    }
    const {
      isNavbarVisible,
      isUserProfileVisible,
      voterDetails,
      isDeletingVoter,
    } = this.state;
    const { firstName } = voterDetails;
    return (
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
