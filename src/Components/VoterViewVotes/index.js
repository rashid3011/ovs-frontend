import React, { Component } from "react";
import Loader from "react-loader-spinner";
import AuthenticateVoter from "../AuthenticateVoter";
import VoterCommon from "../VoterCommon";
import Vote from "./Vote";
import NoVote from "./NoVote";
import "./index.css";

class VoterViewVotes extends Component {
  state = {
    isFetching: true,
    votes: [],
    mp: { type: "mp" },
    mla: { type: "mla" },
    sarpanch: { type: "sarpanch" },
    zptc: { type: "zptc" },
  };

  componentDidMount() {
    this.getVotes();
  }

  getPartyImage = (partyName) => {
    switch (partyName.toLowerCase()) {
      case "bjp":
        return "bjp-logo.png";
      case "congress":
        return "congress-logo.png";
      case "aap":
        return "aap-logo.jpg";
      case "trs":
        return "trs-logo.jpeg";
      default:
        return "others-logo.png";
    }
  };

  getVotes = async () => {
    const { voterId } = JSON.parse(localStorage.getItem("voterDetails"));
    const url = `https://ovs-backend.herokuapp.com/votes/${voterId}`;
    const token = AuthenticateVoter.getToken();
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const { votes } = await response.json();
      this.setState({ votes: votes });
      this.getAllCandidates();
    } else {
      this.setState({ isFetching: false });
    }
  };

  getCandidateDetails = async (candidateId, type) => {
    const url = `https://ovs-backend.herokuapp.com/candidates/${candidateId}`;
    const token = AuthenticateVoter.getToken();
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const { candidate } = await response.json();
    this.setState({ [type]: candidate });
  };

  getAllCandidates = async () => {
    const { votes } = this.state;

    for (let vote of votes) {
      const { candidateId, type } = vote;
      await this.getCandidateDetails(candidateId, type);
    }
    this.setState({ isFetching: false });
  };

  renderLoader = () => {
    return (
      <div className="view-votes-loader">
        <Loader type="Oval" color="blue" height={30} width={130} />
      </div>
    );
  };

  renderVotes = () => {
    const { mp, mla, sarpanch, zptc } = this.state;
    const candidateArray = [mp, mla, sarpanch, zptc];
    return (
      <div className="all-votes-container">
        {candidateArray.map((candidate) => {
          return candidate.candidateId === undefined ? (
            <NoVote candidate={candidate} />
          ) : (
            <Vote candidate={candidate} getPartyImage={this.getPartyImage} />
          );
        })}
      </div>
    );
  };

  render() {
    const { isFetching } = this.state;
    return (
      <div className="view-votes-bg">
        <VoterCommon />
        <h1 className="vote-main-heading">Your Votes</h1>
        {isFetching ? this.renderLoader() : this.renderVotes()}
      </div>
    );
  }
}

export default VoterViewVotes;
