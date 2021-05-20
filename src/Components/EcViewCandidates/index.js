import React, { Component } from "react";
import ViewCandidateProfile from "../ViewCandidateProfile";
import Loader from "react-loader-spinner";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import SearchInput from "../InputFields/SearchInput";
import AuthencticateEc from "../AuthenticateEc";
import RefreshButton from "../RefreshButton";

class EcViewCandidates extends Component {
  state = {
    candidateDetails: [],
    searchCandidateDetails: [],
    isDeleting: false,
    searchValue: "",
  };

  capitalize = (x) => {
    return x.slice(0, 1).toUpperCase() + x.slice(1);
  };

  fetchCandidateDetails = async () => {
    this.setState({ isFetching: true, isDeleting: false });
    const url = "https://ovs-backend.herokuapp.com/EC/candidates";
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
      const { candidates } = data;
      this._mounted &&
        this.setState({
          candidateDetails: candidates,
          searchCandidateDetails: candidates,
          isFetching: false,
        });
    } else {
      this._mounted &&
        this.setState({
          candidateDetails: [],
          searchCandidateDetails: [],
          isFetching: false,
        });
    }
  };

  componentDidMount() {
    this._mounted = true;
    this._mounted && this.fetchCandidateDetails();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  searchData = (event) => {
    const { candidateDetails } = this.state;
    const value = event.target.value;
    const filteredCandidateDetails = candidateDetails.filter((item) => {
      const { candidateId } = item;
      return candidateId.includes(value);
    });
    this.setState({
      searchValue: event.target.value,
      searchCandidateDetails: filteredCandidateDetails,
    });
  };

  renderDetailsHeader = () => {
    const { searchValue } = this.state;
    return (
      <>
        <div className="details-outer-header">
          <SearchInput
            placeholder="search by IDs"
            value={searchValue}
            onChange={this.searchData}
          />
          <RefreshButton onClick={this.fetchCandidateDetails} />
        </div>
        <div className="details-header-details">
          <p>Candidate ID</p>
          <p>First Name</p>
          <p>Last Name</p>
          <p className="delete">Delete</p>
        </div>
      </>
    );
  };

  deleteCandidate = async (item) => {
    const { candidateId } = item;
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

    this.setState({ isDeleting: true });
    await fetch(url, options);
    this.fetchCandidateDetails();
  };

  renderCandidateDeleteConfirmation = (item, close) => {
    const { candidateId, partyName, type } = item;
    return (
      <div className="delete-confirmation-container">
        <h1>Candidate Details</h1>
        <ul className="popup-details">
          <div className="popup-details-left">
            <p>Candidate ID</p>
            <p>Party Name</p>
            <p>Type of Election</p>
          </div>
          <div className="popup-details-center">
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div className="popup-details-right">
            <p>{this.capitalize(candidateId)}</p>
            <p>{this.capitalize(partyName)}</p>
            <p>{this.capitalize(type)}</p>
          </div>
        </ul>
        <p className="message">
          *Are you sure you want to delete Candidate-{candidateId} <br /> Once
          deleted cannot be restored
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

  renderLoader = () => {
    return (
      <Loader
        className="loader"
        type="TailSpin"
        height={30}
        width={30}
        color="blue"
      />
    );
  };

  renderDetailsCandidates = () => {
    const { searchCandidateDetails, isDeleting, isFetching } = this.state;
    return (
      <ul className="details-body">
        {isFetching
          ? this.renderLoader()
          : searchCandidateDetails.length !== 0
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
                    trigger={<i className="fas fa-user-times delete-icon"></i>}
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

  renderDetailsTable = () => {
    return (
      <div className="details-container">
        {this.renderDetailsHeader()}
        {this.renderDetailsCandidates()}
      </div>
    );
  };

  render() {
    const isLoggedIn = AuthencticateEc.authencticate();
    return isLoggedIn !== true ? (
      isLoggedIn
    ) : (
      <div className="ec-view-details-bg">
        <h1 className="table-box-heading">Candidate Details</h1>
        {this.renderDetailsTable()}
      </div>
    );
  }
}

export default EcViewCandidates;
