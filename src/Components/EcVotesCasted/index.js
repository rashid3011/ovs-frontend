import React, { Component } from "react";
import Loader from "react-loader-spinner";
import AuthencticateEc from "../AuthenticateEc";
import Table from "./Table";
import "./index.css";

class EcVotesCasted extends Component {
  state = {
    isFetching: true,
    voteData: [],
  };

  capitalize = (x) => {
    return x
      .split(" ")
      .map((y) => y.slice(0, 1).toUpperCase() + y.slice(1))
      .join(" ");
  };

  capitalizeDetails = (votes) => {
    return votes.map((vote) => {
      const { partyName, type, area } = vote;
      return {
        ...vote,
        partyName: this.capitalize(partyName),
        type: type === "sarpanch" ? this.capitalize(type) : type.toUpperCase(),
        area: this.capitalize(area),
      };
    });
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
    if (response.ok === true) {
      const data = await response.json();
      const { votes } = data;
      this.setState({
        isFetching: false,
        voteData: this.capitalizeDetails(votes),
      });
    } else {
      this.setState({
        isFetching: false,
        voteData: [],
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

  columns = [
    {
      Header: "Voter ID",
      accessor: "voterId",
    },
    {
      Header: "Location",
      accessor: "area",
    },
    {
      Header: "Candidate ID",
      accessor: "candidateId",
    },
    {
      Header: "Party Name",
      accessor: "partyName",
    },
    {
      Header: "Type Of Election",
      accessor: "type",
    },
  ];

  renderVoteData = () => {
    const { isFetching, voteData } = this.state;
    return (
      <div className="view-votes">
        <h1 className="votes-heading">Votes</h1>
        {isFetching ? (
          this.renderLoader()
        ) : voteData.length === 0 ? (
          this.renderNoResults()
        ) : (
          <Table
            data={voteData}
            columns={this.columns}
            onRefresh={this.getVoteData}
          />
        )}
      </div>
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

  render() {
    return <div className="view-votes-container">{this.renderVoteData()}</div>;
  }
}

export default EcVotesCasted;
