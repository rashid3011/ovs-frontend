import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./index.css";

function RefreshButton(props) {
  const { onClick } = props;
  return (
    <Popup
      trigger={
        <button
          type="button"
          className="refresh-button"
          onClick={() => {
            onClick();
          }}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      }
      className="tooltip"
      position="top center"
      on={["hover"]}
    >
      <span className="tooltip-message">Refresh the Table</span>
    </Popup>
  );
}

export default RefreshButton;
