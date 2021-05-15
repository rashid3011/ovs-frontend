import React, { Component } from "react";
import Cookies from "js-cookie";
import Dashboardheader from "../Dashboardheader";
import ViewProfile from "../ViewProfile";
import ViewCandidateProfile from "../ViewCandidateProfile";
import ViewPendingRequests from "../ViewPendingRequests";
import Loader from "react-loader-spinner";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./index.css";
import SearchInput from "../InputFields/SearchInput";

const participants = ["Voter", "Candidate"];

class EcDashboard extends Component {
  state = {
    isEcProfileVisible: false,
    voterDetails: [],
    searchVoterDetails: [],
    isFetching: true,
    activeDetails: "Voter",
    candidateDetails: [],
    searchCandidateDetails: [],
    isDeleting: false,
    searchValue: "",
  };

  toggleEcProfile = () => {
    this.setState((prevState) => ({
      isEcProfileVisible: !prevState.isEcProfileVisible,
    }));
  };

  logout = () => {
    Cookies.remove("token");
    const { history } = this.props;
    history.replace("/ec-login");
  };

  fetchVoterDetails = async () => {
    this.setState({ isFetching: true });
    const url = "https://ovs-backend.herokuapp.com/EC/voters";
    const response = await fetch(url);
    if (response.status === 200) {
      const data = await response.json();
      const { voters } = data;
      this.setState({
        voterDetails: voters,
        searchVoterDetails: voters,
        isFetching: false,
      });
    }
  };

  fetchCandidateDetails = async () => {
    this.setState({ isFetching: true });
    const url = "https://ovs-backend.herokuapp.com/EC/candidates";
    const response = await fetch(url);
    if (response.status === 200) {
      const data = await response.json();
      const { candidates } = data;
      this.setState({
        candidateDetails: candidates,
        searchCandidateDetails: candidates,
        isFetching: false,
      });
    }
  };

  componentDidMount() {
    this.fetchVoterDetails();
    this.fetchCandidateDetails();
  }

  searchData = (event) => {
    const { voterDetails, candidateDetails } = this.state;
    const value = event.target.value;
    const filteredVoterDetails = voterDetails.filter((item) => {
      const { voterId } = item;
      return voterId.includes(value);
    });
    const filteredCandidateDetails = candidateDetails.filter((item) => {
      const { candidateId } = item;
      return candidateId.includes(value);
    });
    this.setState({
      searchValue: event.target.value,
      searchVoterDetails: filteredVoterDetails,
      searchCandidateDetails: filteredCandidateDetails,
    });
  };

  renderDetailsHeader = () => {
    const { activeDetails, searchValue } = this.state;
    return (
      <div className="details-outer-header">
        <div className="details-header">
          {participants.map((item) => {
            const activeClass = item === activeDetails ? "active" : "";
            return (
              <li
                key={item}
                className={`details-header-column ${activeClass}`}
                onClick={this.makeActive}
              >
                {item}
              </li>
            );
          })}
        </div>
        <SearchInput
          placeholder="search by IDs"
          value={searchValue}
          onChange={this.searchData}
        />
        <button
          type="button"
          onClick={() => {
            this.fetchVoterDetails();
            this.fetchCandidateDetails();
          }}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    );
  };

  deleteVoter = async (item) => {
    const { voterId } = item;
    const url = " https://ovs-backend.herokuapp.com/ec/voters";
    const options = {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ voterId: voterId }),
    };

    this.setState({ isDeleting: true });
    await fetch(url, options);
    this.fetchVoterDetails();
  };

  deleteCandidate = async (item) => {
    const { candidateId } = item;
    const url = " https://ovs-backend.herokuapp.com/ec/candidates";
    const options = {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ candidateId: candidateId }),
    };

    this.setState({ isDeleting: true });
    await fetch(url, options);
    this.fetchCandidateDetails();
  };

  renderVoterDeleteConfirmation = (item, close) => {
    const { voterId, firstName, lastName } = item;
    return (
      <div className="delete-confirmation-container">
        <h1>Voter Details</h1>
        <ul>
          <p>Voter ID : {voterId}</p>
          <p>First Name : {firstName}</p>
          <p>Last Name : {lastName}</p>
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

  renderCandidateDeleteConfirmation = (item, close) => {
    const { candidateId, partyName, type } = item;
    return (
      <div className="delete-confirmation-container">
        <h1>Candidate Details</h1>
        <ul>
          <p>Candidate ID : {candidateId}</p>
          <p>First Name : {partyName}</p>
          <p>Last Name : {type}</p>
        </ul>
        <p className="message">
          *Are you sure you want to delete voter-{candidateId} <br /> Once
          deleted cannot be restored
        </p>
        <div className="confirm-buttons-container">
          <button
            className="delete"
            onClick={() => {
              this.deleteCandidate(item);
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

  renderNoResults = (name) => {
    return (
      <div className="no-results">
        <i className="fas fa-exclamation-triangle"></i>
        <h1>No {name} is found</h1>
      </div>
    );
  };

  renderDetailsVoter = () => {
    const { searchVoterDetails, isDeleting, isFetching } = this.state;
    return isFetching ? (
      <Loader
        className="loader"
        type="TailSpin"
        height={30}
        width={30}
        color="blue"
      />
    ) : (
      <ul className="details-body">
        {searchVoterDetails.length !== 0
          ? searchVoterDetails.map((item) => {
              const { voterId, firstName, lastName } = item;
              return (
                <li key={voterId} className="voter-row">
                  <Popup
                    trigger={
                      <p className="id" onClick={this.renderVoterDetails}>
                        {voterId}
                      </p>
                    }
                    modal
                    className="voter-details-popup"
                  >
                    {(close) => {
                      return (
                        <div>
                          <ViewProfile
                            details={item}
                            close={close}
                            rerenderVoters={this.fetchVoterDetails}
                          />
                        </div>
                      );
                    }}
                  </Popup>
                  <p>{firstName}</p>
                  <p>{lastName}</p>
                  <Popup
                    trigger={<i className="fas fa-times delete-icon"></i>}
                    className="delete-user-popup"
                    position="right center"
                    modal
                  >
                    {(close) => {
                      return isDeleting
                        ? this.renderDeleteConfirmed()
                        : this.renderVoterDeleteConfirmation(item, close);
                    }}
                  </Popup>
                </li>
              );
            })
          : this.renderNoResults("Voter")}
      </ul>
    );
  };

  renderDetailsCandidates = () => {
    const { searchCandidateDetails, isDeleting, isFetching } = this.state;
    return isFetching ? (
      <Loader
        className="loader"
        type="TailSpin"
        height={30}
        width={30}
        color="blue"
      />
    ) : (
      <ul className="details-body">
        {searchCandidateDetails.length !== 0
          ? searchCandidateDetails.map((item) => {
              const { candidateId, partyName, type } = item;
              return (
                <li key={candidateId} className="voter-row">
                  <Popup
                    trigger={
                      <p className="id" onClick={this.renderVoterDetails}>
                        {candidateId}
                      </p>
                    }
                    modal
                    className="candidate-nomination-popup"
                  >
                    {(close) => {
                      return (
                        <>
                          <ViewCandidateProfile
                            details={item}
                            close={close}
                            rerenderCandidates={this.fetchCandidateDetails}
                          />
                        </>
                      );
                    }}
                  </Popup>
                  <p>{partyName}</p>
                  <p>{type}</p>
                  <Popup
                    trigger={<i className="fas fa-times delete-icon"></i>}
                    className="delete-user-popup"
                    position="right center"
                    modal
                  >
                    {(close) => {
                      return isDeleting
                        ? this.renderDeleteConfirmed()
                        : this.renderCandidateDeleteConfirmation(
                            item,
                            close,
                            this.fetchVoterDetails
                          );
                    }}
                  </Popup>
                </li>
              );
            })
          : this.renderNoResults("Candidate")}
      </ul>
    );
  };

  makeActive = (event) => {
    this.setState({
      activeDetails: event.target.textContent,
    });
  };

  renderDetailsTable = () => {
    const { activeDetails } = this.state;
    return (
      <div className="details-container">
        {this.renderDetailsHeader()}
        {activeDetails === "Voter"
          ? this.renderDetailsVoter()
          : this.renderDetailsCandidates()}
      </div>
    );
  };

  render() {
    const { isNavbarVisible, isEcProfileVisible } = this.state;
    return (
      <div className="ec-dash-bg">
        <Dashboardheader
          isNavbarVisible={isNavbarVisible}
          isProfileVisible={isEcProfileVisible}
          name="saddam"
          logout={this.logout}
          toggleProfile={this.toggleEcProfile}
          toggleNavbar={this.toggleNavbar}
        />

        {this.renderDetailsTable()}
        <ViewPendingRequests />
      </div>
    );
  }
}

export default EcDashboard;
