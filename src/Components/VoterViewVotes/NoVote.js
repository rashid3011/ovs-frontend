import React from "react";

function NoVote(props) {
  const { candidate } = props;
  const { type } = candidate;
  return (
    <div className="vote-container">
      <h1>{type}</h1>
      <p>You haven't voted yet</p>
      <button className="vote-now-button">Vote Now</button>
    </div>
  );
}

export default NoVote;
