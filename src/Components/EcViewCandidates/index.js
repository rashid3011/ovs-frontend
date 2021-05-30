import React, { Component } from "react";
import Loader from "react-loader-spinner";
import "reactjs-popup/dist/index.css";
import AuthencticateEc from "../AuthenticateEc";
import EcCommon from "../EcCommon";
import Table from "./Table";

class EcViewCandidates extends Component {
  state = {
    candidateDetails: [],
    isFetching: true,
  };

  capitalize = (x) => {
    return x
      .split(" ")
      .map((y) => y.slice(0, 1).toUpperCase() + y.slice(1))
      .join(" ");
  };

  capitalizeDetails = (candidates) => {
    return candidates.map((candidate) => {
      const { partyName, type, firstName, lastName } = candidate;
      return {
        ...candidate,
        partyName: this.capitalize(partyName),
        type: this.capitalize(type),
        firstName: this.capitalize(firstName),
        lastName: this.capitalize(lastName),
      };
    });
  };

  modifyDetails = (candidates) => {
    return candidates.map((candidate) => {
      const { partyName, type, candidateId, voterInfo } = candidate;
      return {
        partyName,
        type,
        candidateId,
        ...voterInfo,
      };
    });
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
    if (response.ok === true) {
      const data = await response.json();
      const { candidates } = data;
      this._mounted &&
        this.setState({
          candidateDetails: this.capitalizeDetails(
            this.modifyDetails(candidates)
          ),
          isFetching: false,
        });
    } else {
      this._mounted &&
        this.setState({
          candidateDetails: [],
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

  columns = [
    {
      Header: "Candidate ID",
      accessor: "candidateId",
    },
    {
      Header: "First Name",
      accessor: "firstName",
    },
    {
      Header: "Last Name",
      accessor: "lastName",
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

  renderDetailsCandidates = () => {
    const { candidateDetails, isFetching } = this.state;
    return (
      <div className="details-body">
        <h1 className="table-box-heading">Candidates</h1>
        {isFetching ? (
          this.renderLoader()
        ) : candidateDetails.length !== 0 ? (
          <Table
            data={candidateDetails}
            columns={this.columns}
            onRefresh={this.fetchCandidateDetails}
          />
        ) : (
          this.renderNoResults("Candidate")
        )}
      </div>
    );
  };

  renderDetailsTable = () => {
    return (
      <div className="details-container">{this.renderDetailsCandidates()}</div>
    );
  };

  render() {
    return (
      <div>
        <EcCommon />
        <div className="ec-view-details-bg">{this.renderDetailsTable()}</div>
      </div>
    );
  }
}

export default EcViewCandidates;
