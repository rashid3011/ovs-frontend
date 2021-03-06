import React from "react";

function Vote(props) {
  const capitalize = (x) => {
    return x
      .split(" ")
      .map((y) => y.slice(0, 1).toUpperCase() + y.slice(1))
      .join(" ");
  };

  const { candidate, getPartyImage } = props;
  const { partyName, type, voterInfo } = candidate;
  const { firstName, lastName } = voterInfo;
  const partyLogo = getPartyImage(partyName);
  return (
    <div className="vote-container">
      <div className="vote-container-header">
        <h1>{type}</h1>
        <img
          src={partyLogo}
          className="view-vote-party-logo"
          alt="party-logo"
        />
      </div>
      <ul className="popup-details">
        <div className="popup-details-left">
          <p>First Name</p>
          <p>Last Name</p>
          <p>Party Name</p>
        </div>
        <div className="popup-details-center">
          <p>:</p>
          <p>:</p>
          <p>:</p>
        </div>
        <div className="popup-details-right">
          <p>{capitalize(firstName)}</p>
          <p>{capitalize(lastName)}</p>
          <p>{partyName.toUpperCase()}</p>
        </div>
      </ul>
    </div>
  );
}

export default Vote;
