import { React, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const navLinks = [
  {
    key: "view-profile",
    value: "Profile",
  },
  {
    key: "update-profile",
    value: "Update Profile",
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

const mlaPartyDetails = [
  {
    logoUrl: "https://i.ibb.co/HCfGQtp/bjp-logo-1-1-removebg-preview.png",
    name: "BJP",
    candidateName: "Narendra Modi",
  },
  {
    logoUrl: "https://i.ibb.co/zHrLkfF/congress.png",
    name: "Congress",
    candidateName: "Rajiv Gandhi",
  },
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "AAP",
    candidateName: "Kejriwal jaadu wala",
  },
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "TUM",
    candidateName: "Kejriwal towel wala",
  },
];

const mpPartyDetails = [
  {
    logoUrl: "https://i.ibb.co/zHrLkfF/congress.png",
    name: "Congress",
    candidateName: "Rajiv Gandhi",
  },
  {
    logoUrl: "https://i.ibb.co/HCfGQtp/bjp-logo-1-1-removebg-preview.png",
    name: "BJP",
    candidateName: "Narendra Modi",
  },
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "TUM",
    candidateName: "Kejriwal towel wala",
  },
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "AAP",
    candidateName: "Kejriwal jaadu wala",
  },
];

const sarpanchPartyDetails = [
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "AAP1",
    candidateName: "Kejriwal jaadu wala",
  },
  {
    logoUrl: "https://i.ibb.co/zHrLkfF/congress.png",
    name: "Congress1",
    candidateName: "Rajiv Gandhi",
  },
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "TUM1",
    candidateName: "Kejriwal towel wala",
  },
  {
    logoUrl: "https://i.ibb.co/HCfGQtp/bjp-logo-1-1-removebg-preview.png",
    name: "BJP1",
    candidateName: "Narendra Modi",
  },
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "AAP",
    candidateName: "Kejriwal jaadu wala",
  },
  {
    logoUrl: "https://i.ibb.co/zHrLkfF/congress.png",
    name: "Congress",
    candidateName: "Rajiv Gandhi",
  },
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "TUM",
    candidateName: "Kejriwal towel wala",
  },
  {
    logoUrl: "https://i.ibb.co/HCfGQtp/bjp-logo-1-1-removebg-preview.png",
    name: "BJP",
    candidateName: "Narendra Modi",
  },
];

const zptcPartyDetails = [
  {
    logoUrl: "https://i.ibb.co/zHrLkfF/congress.png",
    name: "Congress",
    candidateName: "Rajiv Gandhi",
  },
  {
    logoUrl: "https://i.ibb.co/FVww8C7/aap.jpg",
    name: "TUM",
    candidateName: "Kejriwal towel wala",
  },
  {
    logoUrl: "https://i.ibb.co/HCfGQtp/bjp-logo-1-1-removebg-preview.png",
    name: "BJP",
    candidateName: "Narendra Modi",
  },
];

class VoterDashboard extends Component {
  state = {
    isNavbarVisible: false,
    isUserProfileVisible: false,
    activeElectionType: "mla",
    partyDetails: mlaPartyDetails,
  };

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

  changeElectionType = (event) => {
    const electionType = event.target.id;
    let details;
    if (electionType === "mla") {
      details = mlaPartyDetails;
    } else if (electionType === "mp") {
      details = mpPartyDetails;
    } else if (electionType === "sarpanch") {
      details = sarpanchPartyDetails;
    } else {
      details = zptcPartyDetails;
    }

    this.setState({ activeElectionType: electionType, partyDetails: details });
  };

  renderNavbar = () => {
    const { isNavbarVisible } = this.state;
    const classNavbar = isNavbarVisible ? "show-navbar" : "hide-navbar";
    return (
      <div className={`voter-sidebar-container ${classNavbar}`}>
        <i
          className="fas fa-chevron-circle-left close-icon"
          onClick={this.toggleNavbar}
        ></i>
        <nav className="voter-sidebar">
          <ul className="voter-nav-list">
            {navLinks.map((link) => {
              const { key, value } = link;
              return (
                <Link
                  to={`/${key}`}
                  className="voter-navlink"
                  key={key}
                  style={{ textDecoration: "none" }}
                >
                  <li>{value}</li>
                </Link>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  };

  logout = () => {
    Cookies.remove("token");
    const { history } = this.props;
    history.replace("/voter-login");
  };

  renderMenu = () => {
    const { isNavbarVisible, isUserProfileVisible } = this.state;
    const classMenu = isNavbarVisible ? "hide" : "";
    const voterDetails = JSON.parse(localStorage.getItem("voterDetails"));
    const { firstName } = voterDetails;
    const classUserProfile = isUserProfileVisible ? "" : "hide-user-profile";
    return (
      <div className={`nav-menubars-container`}>
        <i
          className={`fas fa-bars nav-menu ${classMenu}`}
          onClick={this.toggleNavbar}
        ></i>
        <div className={`dash-header-right-outer ${classMenu}`}>
          <div className="toggle-user-profile" onClick={this.toggleUserProfile}>
            <i className="far fa-user-circle user-profile-icon"></i>
            <i className="fas fa-sort-down user-profile-arrow"></i>
          </div>
          <div className={`dash-header-right ${classUserProfile}`}>
            <p className="welcome">
              Welcome {firstName.slice(0, 1).toUpperCase() + firstName.slice(1)}
            </p>
            <button className="voter-logout" onClick={this.logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
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

  renderCandidateList = () => {
    const { partyDetails, activeElectionType } = this.state;
    return (
      <div className="party-list-container">
        <ul className="party-list">
          {partyDetails.map((item) => {
            const { logoUrl, name, candidateName } = item;
            return (
              <li
                className="party-list-li"
                key={`${name}-${activeElectionType}`}
              >
                <img src={logoUrl} alt={name} className="party-logo" />
                <p className="party-name">{name}</p>
                <p className="candidate-name">{candidateName}</p>
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
    return (
      <div className="dash-bg">
        {this.renderMenu()}
        {this.renderNavbar()}
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
