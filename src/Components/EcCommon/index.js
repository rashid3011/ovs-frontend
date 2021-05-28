import React, { Component } from "react";
import Dashboardheader from "../Dashboardheader";
import SideBar from "../SideBar";
import AuthencticateEc from "../AuthenticateEc";
import { withRouter } from "react-router";

class EcCommon extends Component {
  state = {
    isNavbarVisible: false,
    isEcProfileVisible: false,
    isDeleting: false,
  };

  navLinks = [
    {
      key: "voter-dashboard",
      value: "Dashboard",
      icon: "home",
    },
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
      icon: "user-tie",
    },
    {
      key: "accept-nominations",
      value: "Accept Nominations",
      icon: "user-clock",
    },
    {
      key: "start-campaign",
      value: "Start Campaign",
      icon: "broadcast-tower",
    },
  ];

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

  render() {
    const { isNavbarVisible, isEcProfileVisible } = this.state;
    const { ecId } = JSON.parse(localStorage.getItem("ecDetails"));
    return (
      <>
        <Dashboardheader
          isNavbarVisible={isNavbarVisible}
          isProfileVisible={isEcProfileVisible}
          name={ecId}
          logout={this.logout}
          toggleProfile={this.toggleEcProfile}
          toggleNavbar={this.toggleNavbar}
        />

        <SideBar
          navLinks={this.navLinks}
          isNavbarVisible={isNavbarVisible}
          toggleNavbar={this.toggleNavbar}
        />
      </>
    );
  }
}

export default withRouter(EcCommon);
