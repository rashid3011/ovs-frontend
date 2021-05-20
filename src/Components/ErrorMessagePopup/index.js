import React from "react";
import Popup from "reactjs-popup";
import "./index.css";

function ErrorMessagePopup(props) {
  const { errorMessage, isPopupOpen, setOpen } = props;
  return (
    <>
      <Popup
        open={isPopupOpen}
        closeOnDocumentClick
        onClose={setOpen}
        modal
        className="error-popup"
      >
        {(close) => {
          return (
            <>
              <p className="register-failed-message">{`Error : ${errorMessage}`}</p>
              <button onClick={close}>Close</button>
            </>
          );
        }}
      </Popup>
    </>
  );
}

export default ErrorMessagePopup;
