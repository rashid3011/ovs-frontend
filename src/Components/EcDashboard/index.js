import React, { Component } from "react";
import Dashboardheader from "../Dashboardheader";
import SideBar from "../SideBar";
import ViewVotesCasted from "../ViewVotesCasted";
import EcViewResults from "../EcViewResults";
import "reactjs-popup/dist/index.css";
import AuthencticateEc from "../AuthenticateEc";
import "./index.css";

const navLinks = [
  {
    key: "create-voter",
    value: "Create Voter",
    icon: "user-plus",
  },
  {
    key: "create-candidate",
    value: "Create Candidate",
    icon: "user-cog",
  },
  {
    key: "view-voters",
    value: "View Voters",
    icon: "users",
  },
  {
    key: "view-candidates",
    value: "View Candidates",
    icon: "user-friends",
  },
  {
    key: "accept-nominations",
    value: "Accept Nominations",
    icon: "user-clock",
  },
];

class EcDashboard extends Component {
  state = {
    isEcProfileVisible: false,
    voterDetails: [],
    searchVoterDetails: [],
    isFetching: true,
    activeDetails: "Voter",
    candidateDetails: [],
    isNavbarVisible: false,
    searchCandidateDetails: [],
    isDeleting: false,
    searchValue: "",
  };

  toggleNavbar = () => {
    this.setState((prevState) => ({
      isNavbarVisible: !prevState.isNavbarVisible,
    }));
  };

  toggleEcProfile = () => {
    this.setState((prevState) => ({
      isEcProfileVisible: !prevState.isEcProfileVisible,
    }));
  };

  logout = () => {
    AuthencticateEc.logout(this.props.history);
  };

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { isNavbarVisible, isEcProfileVisible } = this.state;
    const isLoggedIn = AuthencticateEc.authencticate();
    const { ecId } = JSON.parse(localStorage.getItem("ecDetails"));
    return isLoggedIn !== true ? (
      isLoggedIn
    ) : (
      <div className="ec-dash-bg">
        <Dashboardheader
          isNavbarVisible={isNavbarVisible}
          isProfileVisible={isEcProfileVisible}
          name={ecId}
          logout={this.logout}
          toggleProfile={this.toggleEcProfile}
          toggleNavbar={this.toggleNavbar}
        />

        <SideBar
          navLinks={navLinks}
          isNavbarVisible={isNavbarVisible}
          toggleNavbar={this.toggleNavbar}
        />

        <ViewVotesCasted />
        <EcViewResults />
      </div>
    );
  }
}

export default EcDashboard;
