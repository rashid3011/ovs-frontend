import React, { Component } from "react";
import Loader from "react-loader-spinner";
import AuthenticateEc from "../AuthenticateEc";
import Table from "./Table";
import "./index.css";
import EcCommon from "../EcCommon";

class EcPendingRequests extends Component {
  state = {
    isFetching: true,
    pendingData: [],
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
        partyName,
        type,
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
        partyName: this.capitalize(partyName),
        type: type === "sarpanch" ? this.capitalize(type) : type.toUpperCase(),
        state: this.capitalize(state),
        constituency: this.capitalize(constituency),
        district: this.capitalize(district),
        mandal: this.capitalize(mandal),
        village: this.capitalize(village),
      };
    });
  };

  modifyDetails = (voters) => {
    return voters.map((voter) => {
      const { voterInfo, partyName, type, voterId } = voter;
      return {
        partyName,
        type,
        voterId,
        ...voterInfo,
      };
    });
  };

  getPendingRequests = async () => {
    this.setState({ isFetching: true });
    const url = "https://ovs-backend.herokuapp.com/EC/requests/";
    const token = AuthenticateEc.getToken();
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const { requests } = data;
      console.log(requests);
      this.setState({
        isFetching: false,
        pendingData: this.capitalizeDetails(this.modifyDetails(requests)),
      });
    } else {
      this.setState({
        isFetching: false,
        pendingData: [],
      });
    }
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
      Header: "Party Name",
      accessor: "partyName",
    },
    {
      Header: "Type of Election",
      accessor: "type",
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

  renderPendingRequests = () => {
    const { isFetching, pendingData } = this.state;
    return (
      <div className="pending-requests">
        <h1>Pending Requests</h1>
        {isFetching ? (
          this.renderLoader()
        ) : pendingData.length === 0 ? (
          this.renderNoResults()
        ) : (
          <Table
            data={pendingData}
            columns={this.columns}
            onRefresh={this.getPendingRequests}
          />
        )}
      </div>
    );
  };

  renderNoResults = () => {
    return (
      <div className="no-results">
        <i className="fas fa-exclamation-triangle"></i>
        <h1>No More Pending Requests Found</h1>
      </div>
    );
  };

  render() {
    return (
      <div>
        <EcCommon />
        <div className="pending-requests-container">
          {this.renderPendingRequests()}
        </div>
      </div>
    );
  }
}

export default EcPendingRequests;
