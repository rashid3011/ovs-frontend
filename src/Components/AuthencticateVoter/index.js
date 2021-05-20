import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";

class AuthencticateVoter {
  token_name = "ovsvoter";
  authencticate() {
    const cookie = Cookies.get(this.token_name);
    if (cookie === undefined) {
      return <Redirect to="/voter-login" />;
    } else {
      const { token, role } = JSON.parse(cookie);
      if (token === undefined || role !== "voter") {
        return <Redirect to="/voter-login" />;
      } else {
        return true;
      }
    }
  }

  refreshToken = async (voter) => {
    const token = await this.getNewToken();
    this.setToken(voter, token);
  };

  getNewToken = async (oldToken) => {
    const url = "https://ovs-backend.herokuapp.com/refresh-token";
    const options = {
      method: "POST",

      headers: {
        Authorization: `bearer ${this.getToken()}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    const { token } = data;
    return token;
  };

  login = (data, history) => {
    const { token, voter } = data;
    localStorage.setItem("voterDetails", JSON.stringify(voter));
    this.setToken(voter, token);
    this.intervalId = setInterval(() => {
      this.refreshToken(voter);
    }, 29 * 60 * 1000);
    history.replace("/voter-dashboard");
  };

  setToken = (voter, token) => {
    const { role } = voter;
    Cookies.set(
      this.token_name,
      { token, role },
      {
        path: "/",
      }
    );
  };

  logout = (history) => {
    Cookies.remove(this.token_name);
    localStorage.removeItem("voterDetails");
    history.replace("/voter-login");
  };

  getToken = () => {
    const cookie = Cookies.get(this.token_name);
    const token = cookie !== undefined ? JSON.parse(cookie).token : "";
    return token;
  };
}

export default new AuthencticateVoter();
