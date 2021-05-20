import React, { Component } from "react";
import Loader from "react-loader-spinner";
import SearchInput from "../InputFields/SearchInput";
import AuthencticateEc from "../AuthenticateEc";
import RefreshButton from "../RefreshButton";
import "./index.css";

class ViewVotesCasted extends Component {
  state = {
    isFetching: true,
    voteData: [],
    searchVoteData: [],
    searchValue: "",
  };

  getVoteData = async () => {
    this.setState({ isFetching: true });
    const url = "https://ovs-backend.herokuapp.com/ec/votes/";
    const token = AuthencticateEc.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.status !== 404) {
      const data = await response.json();
      const { votes } = data;
      this.setState({
        isFetching: false,
        voteData: votes,
        searchVoteData: votes,
      });
    } else {
      this.setState({
        isFetching: false,
        voteData: [],
        searchVoteData: [],
      });
    }
  };

  componentDidMount() {
    this.getVoteData();
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

  renderVoteData = () => {
    const { isFetching, searchVoteData } = this.state;
    return (
      <ul className="pending-list">
        {isFetching
          ? this.renderLoader()
          : searchVoteData.length === 0
          ? this.renderNoResults()
          : searchVoteData.map((item) => {
              const { voterId, candidateId, partyName, type, area } = item;
              return (
                <li key={voterId} className="pending-list-item">
                  <p className="voter-id">{voterId}</p>
                  <p className="voter-id">{candidateId}</p>
                  <p>{partyName}</p>
                  <p>{type}</p>
                  <p>{area}</p>
                </li>
              );
            })}
      </ul>
    );
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
    const { voteData } = this.state;
    const value = event.target.value;
    const modifiedPendingData = voteData.filter((item) => {
      const { voterId } = item;
      return voterId.includes(value);
    });
    this.setState({
      searchValue: value,
      searchVoteData: modifiedPendingData,
    });
  };

  renderVoteHeader = () => {
    const { searchValue } = this.state;
    return (
      <>
        <div className="details-outer-header">
          <SearchInput
            placeholder="search by IDs"
            value={searchValue}
            onChange={this.search}
          />
          <RefreshButton onClick={this.getVoteData} />
        </div>
      </>
    );
  };

  render() {
    return (
      <div className="pending-requests-container">
        {this.renderVoteHeader()}
        {this.renderVoteData()}
      </div>
    );
  }
}

export default ViewVotesCasted;
