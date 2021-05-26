import React, { Component } from "react";
import Loader from "react-loader-spinner";
import "reactjs-popup/dist/index.css";
import AuthencticateEc from "../AuthenticateEc";
import Table from "./Table";
import "./index.css";

class EcViewVoters extends Component {
  state = {
    voterDetails: [],
    isFetching: true,
  };

  capitalize = (x) => {
    return x
      .split(" ")
      .map((y) => y.slice(0, 1).toUpperCase() + y.slice(1))
      .join(" ");
  };

  capitalizeDetails = (voters) => {
    return voters.map((voter) => {
      const {
        firstName,
        lastName,
        state,
        constituency,
        district,
        mandal,
        village,
      } = voter;
      return {
        ...voter,
        firstName: this.capitalize(firstName),
        lastName: this.capitalize(lastName),
        state: this.capitalize(state),
        constituency: this.capitalize(constituency),
        district: this.capitalize(district),
        mandal: this.capitalize(mandal),
        village: this.capitalize(village),
      };
    });
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
    if (response.ok === true) {
      const data = await response.json();
      const { voters } = data;
      this._mounted &&
        this.setState({
          voterDetails: this.capitalizeDetails(voters),
          isFetching: false,
        });
    } else {
      this._mounted &&
        this.setState({
          voterDetails: [],
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
      Header: "Voter ID",
      accessor: "voterId",
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
      Header: "State",
      accessor: "state",
    },
    {
      Header: "District",
      accessor: "district",
    },
    {
      Header: "Constituency",
      accessor: "constituency",
    },
    {
      Header: "Mandal",
      accessor: "mandal",
    },
    {
      Header: "Village",
      accessor: "village",
    },
  ];

  renderDetailsVoter = () => {
    const { voterDetails, isFetching } = this.state;
    return (
      <div className="details-body">
        <h1 className="table-box-heading">Voters</h1>
        {isFetching ? (
          this.renderLoader()
        ) : voterDetails.length !== 0 ? (
          <Table
            data={voterDetails}
            columns={this.columns}
            onRefresh={this.fetchVoterDetails}
          />
        ) : (
          this.renderNoResults("Voter")
        )}
      </div>
    );
  };

  renderDetailsTable = () => {
    return <div className="details-container">{this.renderDetailsVoter()}</div>;
  };

  render() {
    return (
      <div className="ec-view-details-bg">{this.renderDetailsTable()}</div>
    );
  }
}

export default EcViewVoters;
