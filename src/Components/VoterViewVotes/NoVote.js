import React from "react";
import { withRouter } from "react-router";

function NoVote(props) {
  const { candidate, history } = props;
  const { type } = candidate;
  return (
    <div className="vote-container">
      <h1>{type}</h1>
      <p>You haven't voted yet</p>
      <button
        className="vote-now-button"
        onClick={() => {
          history.push("/voter-dashboard");
        }}
      >
        Vote Now
      </button>
    </div>
  );
}

export default withRouter(NoVote);
