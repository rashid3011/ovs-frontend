import React from "react";
import { Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

function Home() {
  if (Cookies.get("token") !== undefined) {
    return <Redirect to="/voter-dashboard" />;
  }
  return (
    <div className="home-bg">
      <h1 className="home-main-heading">
        <span>Welcome</span> <br />
        to Online Voting System
      </h1>
      <div className="home-content">
        <div className="home-section home-voter-section">
          <h1 className="home-voter-heading">
            <span>
              <i className="fas fa-user-alt"></i>
            </span>
            Voter
          </h1>
          <p>
            If you are an Voter or a Candidate
            <br />
            login here
          </p>
          <Link to="/voter-login">
            <button className="home-voter-button">Login as Voter</button>
          </Link>
        </div>
        <div className="home-section home-ec-section">
          <h1 className="home-ec-heading">
            <span>
              <i className="fas fa-user-tie"></i>
            </span>
            EC
          </h1>
          <p>
            If you are an Election Commisioner
            <br />
            login here
          </p>
          <Link to="/ec-login">
            <button className="home-ec-button">Login as EC</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
