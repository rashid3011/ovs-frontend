import React, { Component } from "react";
import ViewProfile from "../ViewProfile";
import Loader from "react-loader-spinner";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import SearchInput from "../InputFields/SearchInput";
import AuthencticateEc from "../AuthenticateEc";
import RefreshButton from "../RefreshButton";
import "./index.css";

class EcViewVoters extends Component {
  state = {
    voterDetails: [],
    searchVoterDetails: [],
    isFetching: true,
    isDeleting: false,
    searchValue: "",
  };

  capitalize = (x) => {
    return x.slice(0, 1).toUpperCase() + x.slice(1);
  };

  fetchVoterDetails = async () => {
    this.setState({ isFetching: true, isDeleting: false });
    const url = "https://ovs-backend.herokuapp.com/EC/voters";
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
      const { voters } = data;
      this._mounted &&
        this.setState({
          voterDetails: voters,
          searchVoterDetails: voters,
          isFetching: false,
        });
    } else {
      this._mounted &&
        this.setState({
          voterDetails: [],
          searchVoterDetails: [],
          isFetching: false,
        });
    }
  };

  componentDidMount() {
    this._mounted = true;
    this._mounted && this.fetchVoterDetails();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  searchData = (event) => {
    const { voterDetails } = this.state;
    const value = event.target.value;
    const filteredVoterDetails = voterDetails.filter((item) => {
      const { voterId } = item;
      return voterId.includes(value);
    });
    this.setState({
      searchValue: event.target.value,
      searchVoterDetails: filteredVoterDetails,
    });
  };

  deleteVoter = async (item) => {
    const { voterId } = item;
    const url = " https://ovs-backend.herokuapp.com/ec/voters";
    const token = AuthencticateEc.getToken();
    const options = {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify({ voterId: voterId }),
    };

    this.setState({ isDeleting: true });
    await fetch(url, options);
    this.fetchVoterDetails();
  };

  renderVoterDeleteConfirmation = (item, close) => {
    const { voterId, firstName, lastName } = item;
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
            <p>{this.capitalize(voterId)}</p>
            <p>{this.capitalize(firstName)}</p>
            <p>{this.capitalize(lastName)}</p>
          </div>
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
          <RefreshButton onClick={this.fetchVoterDetails} />
        </div>
        <div className="details-header-details">
          <p>Voter ID</p>
          <p>First Name</p>
          <p>Last Name</p>
          <p className="delete">Delete</p>
        </div>
      </>
    );
  };

  renderDetailsVoter = () => {
    const { searchVoterDetails, isDeleting, isFetching } = this.state;
    return (
      <ul className="details-body">
        {isFetching
          ? this.renderLoader()
          : searchVoterDetails.length !== 0
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
                    trigger={<i className="fas fa-user-times delete-icon"></i>}
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

  renderDetailsTable = () => {
    return (
      <div className="details-container">
        {this.renderDetailsHeader()}
        {this.renderDetailsVoter()}
      </div>
    );
  };

  render() {
    const isLoggedIn = AuthencticateEc.authencticate();
    return isLoggedIn !== true ? (
      isLoggedIn
    ) : (
      <div className="ec-view-details-bg">
        <h1 className="table-box-heading">Voter Details</h1>
        {this.renderDetailsTable()}
      </div>
    );
  }
}

export default EcViewVoters;
