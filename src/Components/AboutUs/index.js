import React from "react";
import { withRouter } from "react-router-dom";
import "./index.css";

function AboutUs(props) {
  const { history } = props;
  const renderBackToHome = () => {
    return (
      <div
        className="back-to-home"
        onClick={() => {
          history.goBack();
        }}
      >
        <i className="fas fa-long-arrow-alt-left back-arrow"></i>
      </div>
    );
  };

  return (
    <div className="about-us-bg">
      {renderBackToHome()}
      <h1 className="about-us-heading">About Us</h1>
      <hr />
      <h1 className="question">
        Who <span className="question-normal">are we ?</span>
      </h1>
      <p className="answer">
        We are a team of <span className="highlight">Web Developers</span> whose
        motive is to provide best quality web services.
      </p>
      <hr />
      <h1 className="question">
        Why <span className="question-normal">this project ?</span>
      </h1>
      <p className="answer">
        To Remove Problems in current exisiting system of Election of{" "}
        <span className="highlight">INDIA</span>
      </p>
      <hr />
      <h1 className="question">
        How <span className="question-normal">are we doing this ?</span>
      </h1>
      <p className="answer">
        We have integrated <span className="highlight">BlockChain</span> to this
        project so that votes cannot be manipulated or miscounted
      </p>
    </div>
  );
}

export default withRouter(AboutUs);
