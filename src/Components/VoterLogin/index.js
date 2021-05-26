import { Component } from "react";
import LoginForm from "./LoginForm";
import SvgImage from "./SvgImage";
import "./index.css";
import SendOtp from "./SendOtp";
import VerifyOtp from "./VerifyOtp";
import ChangePassword from "./ChangePassword";

class VoterLogin extends Component {
  state = {
    activeForm: "login",
  };

  changeForm = (value) => {
    this.setState({ activeForm: value });
  };

  renderForm = () => {
    const { activeForm } = this.state;
    switch (activeForm) {
      case "login":
        return <LoginForm changeForm={this.changeForm} />;
      case "sendOtp":
        return <SendOtp changeForm={this.changeForm} />;
      case "verifyOtp":
        return <VerifyOtp changeForm={this.changeForm} />;
      case "changePassword":
        return <ChangePassword changeForm={this.changeForm} />;
      default:
        return <LoginForm changeForm={this.changeForm} />;
    }
  };

  render() {
    return (
      <div className="voter-login-bg">
        {this.renderForm()}
        <SvgImage />
      </div>
    );
  }
}

export default VoterLogin;
