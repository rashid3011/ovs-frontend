import React, { Component } from "react";
import Loader from "react-loader-spinner";
import Popup from "reactjs-popup";
import SearchInput from "../InputFields/SearchInput";
import "./index.css";

class ViewPendingRequests extends Component {
  state = {
    isFetching: true,
    pendingData: [],
    searchPendingData: [],
    searchValue: "",
    isSendingData: false,
    isAccepted: false,
  };

  getPendingRequests = async () => {
    this.setState({ isFetching: true });
    const url = "https://ovs-backend.herokuapp.com/EC/requests/";
    const options = {
      method: "GET",
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const { requests } = data;
    this.setState({
      isFetching: false,
      pendingData: requests,
      searchPendingData: requests,
    });
  };

  componentDidMount() {
    this.getPendingRequests();
  }

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

  renderPendingRequests = () => {
    const { searchPendingData } = this.state;
    return (
      <ul className="pending-list">
        {searchPendingData.length === 0
          ? this.renderNoResults()
          : searchPendingData.map((item) => {
              const { voterId, partyName, type } = item;
              return (
                <li key={voterId} className="pending-list-item">
                  <p className="voter-id">{voterId}</p>
                  <p>{partyName}</p>
                  <p>{type}</p>
                  <Popup
                    trigger={<i className="fas fa-check"></i>}
                    modal
                    className="approval-popup"
                  >
                    {(close) => this.renderApprovalConfirmation(item, close)}
                  </Popup>
                  <Popup
                    trigger={<i className="fas fa-times delete-icon"></i>}
                    className="approval-popup"
                    position="right center"
                    modal
                  >
                    {(close) => this.renderRejectConfirmation(item, close)}
                  </Popup>
                </li>
              );
            })}
      </ul>
    );
  };

  renderConfirmed = () => {
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

  renderApprovalConfirmation = (item, close) => {
    const { voterId, partyName, type, candidateId } = item;
    const { isSendingData, isAccepted } = this.state;
    return isSendingData ? (
      this.renderLoader()
    ) : isAccepted ? (
      this.renderConfirmed()
    ) : (
      <>
        <div className="approval-container-header">
          <h1>Nomination Details</h1>
          <i className="fas fa-times" onClick={close}></i>
        </div>
        <p>{`Voter ID : ${voterId}`}</p>
        <p>{`Party Name : ${partyName}`}</p>
        <p>{`Type of Election : ${type}`}</p>
        <div className="approval-buttons-container">
          <button
            className="approve"
            type="button"
            onClick={() => {
              this.acceptNomination(candidateId);
            }}
          >
            Approve
          </button>
        </div>
      </>
    );
  };

  acceptNomination = async (candidateId) => {
    this.setState({ isSendingData: true });
    const url = "https://ovs-backend.herokuapp.com/ec/accept-nomination";
    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ candidateId }),
    };

    const response = await fetch(url, options);
    if (response.status === 200) {
      this.setState({ isSendingData: false, isAccepted: true });
      setTimeout(() => {
        this.setState({ isAccepted: false });
        this.getPendingRequests();
      }, 3000);
    }
  };

  renderRejectConfirmation = (item, close) => {
    const { voterId, partyName, type, candidateId } = item;
    const { isSendingData, isAccepted } = this.state;
    return isSendingData ? (
      this.renderLoader()
    ) : isAccepted ? (
      this.renderConfirmed()
    ) : (
      <>
        <div className="approval-container-header">
          <h1>Nomination Details</h1>
          <i className="fas fa-times" onClick={close}></i>
        </div>
        <p>{`Voter ID : ${voterId}`}</p>
        <p>{`Party Name : ${partyName}`}</p>
        <p>{`Type of Election : ${type}`}</p>
        <div className="approval-buttons-container">
          <button
            className="reject"
            type="button"
            onClick={() => {
              this.rejectNomination(candidateId);
            }}
          >
            Reject
          </button>
        </div>
      </>
    );
  };

  rejectNomination = async (candidateId) => {
    const url = " https://ovs-backend.herokuapp.com/ec/candidates";
    const options = {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ candidateId: candidateId }),
    };

    this.setState({ isSendingData: true });
    const response = await fetch(url, options);
    if (response.status === 200) {
      this.setState({ isSendingData: false, isAccepted: true });
      setTimeout(() => {
        this.setState({ isAccepted: false });
        this.getPendingRequests();
      }, 3000);
    }
  };

  renderNoResults = () => {
    return (
      <div className="no-results">
        <i className="fas fa-exclamation-triangle"></i>
        <h1>no Data found</h1>
      </div>
    );
  };

  search = (event) => {
    const { pendingData } = this.state;
    const value = event.target.value;
    const modifiedPendingData = pendingData.filter((item) => {
      const { voterId } = item;
      return voterId.includes(value);
    });
    this.setState({
      searchValue: value,
      searchPendingData: modifiedPendingData,
    });
  };

  render() {
    const { isFetching, searchValue } = this.state;
    return (
      <div className="pending-requests-container">
        <div className="pending-request-header">
          <h1 className="pending-heading">Pending Requests</h1>
          <SearchInput
            placeholder="search by IDs"
            value={searchValue}
            onChange={this.search}
          />
          <button type="button" onClick={this.getPendingRequests}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
        {isFetching ? this.renderLoader() : this.renderPendingRequests()}
      </div>
    );
  }
}

export default ViewPendingRequests;
