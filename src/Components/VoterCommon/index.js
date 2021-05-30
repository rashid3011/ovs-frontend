import React, { Component } from "react";
import VoterSidebar from "../VoterSidebar";
import Dashboardheader from "../Dashboardheader";
import AuthenticateVoter from "../AuthenticateVoter";
import { withRouter } from "react-router";

export class VoterCommon extends Component {
  state = {
    isNavbarVisible: false,
    isUserProfileVisible: false,
    isDeletingVoter: false,
  };

  navLinks = [
    {
      key: "voter-dashboard",
      value: "Dashboard",
      icon: "home",
    },
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
    {
      key: "voter-votes",
      value: "View Votes",
      icon: "vote-yea",
    },
    {
      key: "donation",
      value: "Donation",
      icon: "money-bill-alt",
    },
  ];

  logout = () => {
    AuthenticateVoter.logout(this.props.history);
  };

  deleteVoter = async (item) => {
    const { voterDetails } = this.state;
    const { voterId } = voterDetails;
    const url = " https://ovs-backend.herokuapp.com/voters";
    const token = AuthenticateVoter.getToken();
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
    AuthenticateVoter.logout(this.props.history);
  };

  renderDeleteConfirmation = (close) => {
    const voterDetails = JSON.parse(localStorage.getItem("voterDetails"));
    const { voterId, firstName, lastName } = voterDetails;
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
        <p className="message">Are you sure you want to delete your account?</p>
        <div className="confirm-buttons-container">
          <button
            className="delete"
            onClick={() => {
              this.deleteVoter(voterDetails);
            }}
          >
            Delete
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

  capitalize = (x) => x.slice(0, 1).toUpperCase() + x.slice(1);

  render() {
    const { isNavbarVisible, isUserProfileVisible, isDeletingVoter } =
      this.state;
    const voterDetails = localStorage.getItem("voterDetails");
    const firstName =
      voterDetails === null ? "" : JSON.parse(voterDetails).firstName;
    const lastName =
      voterDetails === null ? "" : JSON.parse(voterDetails).lastName;
    return (
      <>
        <Dashboardheader
          isNavbarVisible={isNavbarVisible}
          isProfileVisible={isUserProfileVisible}
          name={this.capitalize(firstName) + " " + this.capitalize(lastName)}
          logout={this.logout}
          toggleProfile={this.toggleUserProfile}
          toggleNavbar={this.toggleNavbar}
        />
        <VoterSidebar
          navLinks={this.navLinks}
          isNavbarVisible={isNavbarVisible}
          toggleNavbar={this.toggleNavbar}
          isDeletingVoter={isDeletingVoter}
          renderDeleteConfirmed={this.renderDeleteConfirmed}
          renderDeleteConfirmation={this.renderDeleteConfirmation}
          details={voterDetails}
        />
      </>
    );
  }
}

export default withRouter(VoterCommon);
