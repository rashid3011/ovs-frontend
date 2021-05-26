import React, { Component } from "react";
import AuthencticateEc from "../AuthenticateEc";
import Loader from "react-loader-spinner";

class NominationPopup extends Component {
  state = {
    isSendingData: false,
    isSentData: false,
  };

  capitalize = (x) => {
    return x
      .split(" ")
      .map((y) => y.slice(0, 1).toUpperCase() + y.slice(1))
      .join(" ");
  };

  renderConfirmed = () => {
    return (
      <div className="confirmed-image-container" style={{ width: "100%" }}>
        <img
          src="confirmed.gif"
          alt="confirmed"
          className="confirmed-image"
        ></img>
        <p>Successfully done!</p>
      </div>
    );
  };

  acceptNomination = async (candidateId) => {
    const { fetchPendingDetails } = this.props;
    this.setState({ isSendingData: true });
    const url = "https://ovs-backend.herokuapp.com/ec/accept-nomination";
    const token = AuthencticateEc.getToken();
    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify({ candidateId }),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isSendingData: false, isSentData: true });
      setTimeout(() => {
        this.setState({ isSentData: false });
        fetchPendingDetails();
      }, 1000);
    }
  };

  rejectNomination = async (candidateId) => {
    const { fetchPendingDetails } = this.props;
    this.setState({ isSendingData: true });
    const url = " https://ovs-backend.herokuapp.com/ec/candidates";
    const token = AuthencticateEc.getToken();
    const options = {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify({ candidateId: candidateId }),
    };

    this.setState({ isSendingData: true });
    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isSendingData: false, isSentData: true });
      setTimeout(() => {
        this.setState({ isSentData: false });
        fetchPendingDetails();
      }, 3000);
    }
  };

  renderConfirmation = () => {
    const { details } = this.props;
    const { voterId, firstName, lastName, type, partyName } = details;
    const candidateId = `C${voterId.slice(1)}`;
    return (
      <div className="nomination-popup-details">
        <h1>Nominee Details</h1>
        <ul className="popup-details">
          <div className="popup-details-left">
            <p>Voter ID</p>
            <p>Name</p>
            <p>Party Name</p>
            <p>Type of Election</p>
          </div>
          <div className="popup-details-center">
            <p>:</p>
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div className="popup-details-right">
            <p>{voterId}</p>
            <p>{`${this.capitalize(firstName)} ${this.capitalize(
              lastName
            )}`}</p>
            <p>{this.capitalize(partyName)}</p>
            <p>{this.capitalize(type)}</p>
          </div>
        </ul>
        <div className="buttons-container">
          <button
            className="approve"
            onClick={() => {
              this.acceptNomination(candidateId);
            }}
          >
            Approve
          </button>
          <button
            className="reject"
            onClick={() => {
              this.rejectNomination(candidateId);
            }}
          >
            Reject
          </button>
        </div>
      </div>
    );
  };

  renderLoader = () => {
    return (
      <div className="loader-container">
        <Loader
          className="pending-loader"
          type="TailSpin"
          width={35}
          height={35}
          color="blue"
        />
      </div>
    );
  };

  render() {
    const { isSendingData, isSentData } = this.state;
    return isSendingData
      ? this.renderLoader()
      : isSentData
      ? this.renderConfirmed()
      : this.renderConfirmation();
  }
}

export default NominationPopup;
