import React, { Component } from "react";
import ViewProfile from "../ViewProfile";
import Loader from "react-loader-spinner";
import Popup from "reactjs-popup";
import SearchInput from "../InputFields/SearchInput";
import AuthencticateEc from "../AuthenticateEc";
import RefreshButton from "../RefreshButton";
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
    const token = AuthencticateEc.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.status === 200) {
      const data = await response.json();
      const { requests } = data;
      console.log(requests);
      this.setState({
        isFetching: false,
        pendingData: requests,
        searchPendingData: requests,
      });
    } else {
      this.setState({
        isFetching: false,
        pendingData: [],
        searchPendingData: [],
      });
    }
  };

  componentDidMount() {
    this.getPendingRequests();
  }

  capitalize = (x) => {
    return x.slice(0, 1).toUpperCase() + x.slice(1);
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

  renderPendingRequests = () => {
    const { isFetching, searchPendingData } = this.state;
    console.log(searchPendingData);
    return (
      <ul className="pending-list">
        {isFetching
          ? this.renderLoader()
          : searchPendingData.length === 0
          ? this.renderNoResults()
          : searchPendingData.map((item) => {
              const { voterId, partyName, type } = item;
              let { voterInfo } = item;
              voterInfo = {
                ...voterInfo,
                voterId,
              };
              return (
                <li key={voterId} className="pending-list-item">
                  <Popup
                    trigger={<p className="voter-id">{voterId}</p>}
                    modal
                    className="voter-details-popup"
                  >
                    {(close) => {
                      return (
                        <div>
                          <ViewProfile
                            details={voterInfo}
                            close={close}
                            rerenderVoters={this.getPendingRequests}
                          />
                        </div>
                      );
                    }}
                  </Popup>
                  <p>{partyName}</p>
                  <p>{type}</p>
                  <Popup
                    trigger={<i className="fas fa-user-check"></i>}
                    modal
                    className="approval-popup"
                  >
                    {(close) => this.renderApprovalConfirmation(item, close)}
                  </Popup>
                  <Popup
                    trigger={<i className="fas fa-user-times delete-icon"></i>}
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
        <ul className="popup-details">
          <div className="popup-details-left">
            <p>Voter ID</p>
            <p>Party Name</p>
            <p>Type</p>
          </div>
          <div className="popup-details-center">
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div className="popup-details-right">
            <p>{this.capitalize(voterId)}</p>
            <p>{this.capitalize(partyName)}</p>
            <p>{this.capitalize(type)}</p>
          </div>
        </ul>
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
    if (response.status === 200) {
      this.setState({ isSendingData: false, isAccepted: true });
      setTimeout(() => {
        this.setState({ isAccepted: false });
        this.getPendingRequests();
      }, 1000);
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
        <ul className="popup-details">
          <div className="popup-details-left">
            <p>Voter ID</p>
            <p>Party Name</p>
            <p>Type</p>
          </div>
          <div className="popup-details-center">
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div className="popup-details-right">
            <p>{this.capitalize(voterId)}</p>
            <p>{this.capitalize(partyName)}</p>
            <p>{this.capitalize(type)}</p>
          </div>
        </ul>
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
    const { searchValue } = this.state;
    return (
      <div className="pending-requests-container">
        <h1 className="pending-heading">Pending Requests</h1>
        <div className="pending-request-header">
          <SearchInput
            placeholder="search by IDs"
            value={searchValue}
            onChange={this.search}
          />
          <RefreshButton onClick={this.getPendingRequests} />
        </div>
        {this.renderPendingRequests()}
      </div>
    );
  }
}

export default ViewPendingRequests;
