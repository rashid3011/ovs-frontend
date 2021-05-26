import React, { Component } from "react";
import Popup from "reactjs-popup";
import Loader from "react-loader-spinner";
import AuthenticationVoter from "../AuthencticateVoter";
import "./index.css";

class CastVotePopup extends Component {
  state = {
    isCastingVote: false,
    isCastVoteSuccessfull: false,
    isCastVoteFailed: false,
    errorMessage: "",
  };

  renderConfirmed = () => {
    return (
      <div className="confirmed-image-container">
        <img
          src="confirmed.gif"
          alt="confirmed"
          className="confirmed-image"
        ></img>
        <p style={{ color: "green" }}>Vote is successfully casted</p>
      </div>
    );
  };

  capitalize = (x) => x.slice(0, 1).toUpperCase() + x.slice(1);

  renderVoteConfirmation = (item, close) => {
    const { partyName, voterInfo, type, candidateId } = item;
    const { firstName, lastName } = voterInfo;
    return (
      <div className="delete-confirmation-container cast-vote-popup">
        <h1 className="vote-confirmation-heading">Voter Details</h1>
        <ul className="popup-details">
          <div className="popup-details-left">
            <p>Candidate Name</p>
            <p>Party Name</p>
            <p>Type of Election</p>
          </div>
          <div className="popup-details-center">
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div className="popup-details-right">
            <p className="candidate-name">{`${this.capitalize(
              firstName
            )} ${this.capitalize(lastName)}`}</p>
            <p className="party-name">{this.capitalize(partyName)}</p>
            <p>{this.capitalize(type)}</p>
          </div>
        </ul>
        <p className="vote-warning">*This action can't be undone</p>
        <div className="buttons-container">
          <button
            className="cast-vote-button"
            onClick={() => {
              this.castVote(candidateId, close);
            }}
          >
            Cast Vote
          </button>
          <button type="button" onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  castVote = async (candidateId, close) => {
    this.setState({ isCastingVote: true, isCastVoteSuccessfull: false });
    const url = "https://ovs-backend.herokuapp.com/cast-vote";
    const voterDetails = JSON.parse(localStorage.getItem("voterDetails"));
    const { voterId } = voterDetails;
    const details = {
      voterId,
      candidateId,
    };
    const token = AuthenticationVoter.getToken();
    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify(details),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isCastingVote: false, isCastVoteSuccessfull: true });
      setTimeout(() => {
        this.setState({ isCastVoteSuccessfull: false });
        close();
      }, 2000);
    } else {
      const data = await response.json();
      const { message } = data;
      this.setState({
        isCastingVote: false,
        isCastVoteFailed: true,
        errorMessage: message,
      });
    }
  };

  renderCastVoteFailed = (close) => {
    const { errorMessage } = this.state;
    return (
      <div className="vote-error-message-container">
        <p className="cast-vote-error-message">{errorMessage}</p>
        <button
          type="button"
          className="close-button"
          onClick={() => {
            close();
            this.setState({
              isCastVoteFailed: false,
              isCastVoteSuccessfull: false,
              isCastingVote: false,
            });
          }}
        >
          Close
        </button>
      </div>
    );
  };

  renderLoader = () => {
    return (
      <Loader
        className="pending-loader"
        type="ThreeDots"
        width={35}
        height={35}
        color="blue"
      />
    );
  };

  render() {
    const { isCastingVote, isCastVoteSuccessfull, isCastVoteFailed } =
      this.state;
    const { details } = this.props;
    return (
      <div>
        <Popup
          trigger={<button className="cast-vote-button">Vote</button>}
          modal
          className="cast-vote-confirmation"
        >
          {(close) =>
            isCastVoteSuccessfull
              ? this.renderConfirmed()
              : isCastingVote
              ? this.renderLoader()
              : isCastVoteFailed
              ? this.renderCastVoteFailed(close)
              : this.renderVoteConfirmation(details, close)
          }
        </Popup>
      </div>
    );
  }
}

export default CastVotePopup;
