import React, { Component } from "react";
import EcVotesCasted from "../EcVotesCasted";
import EcViewResults from "../EcViewResults";
import "reactjs-popup/dist/index.css";
import "./index.css";
import EcCommon from "../EcCommon";

class EcDashboard extends Component {
  state = {
    voterDetails: [],
    searchVoterDetails: [],
    isFetching: true,
    activeDetails: "Voter",
    candidateDetails: [],
  };

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return (
      <div className="ec-dash-bg">
        <EcCommon />

        <EcVotesCasted />
        <EcViewResults />
      </div>
    );
  }
}

export default EcDashboard;
