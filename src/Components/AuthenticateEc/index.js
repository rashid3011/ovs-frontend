import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";

class AuthencticateEc {
  token_name = "ovsec";
  intervalId = "";
  authencticate() {
    const cookie = Cookies.get(this.token_name);
    if (cookie === undefined) {
      return <Redirect to="/ec-login" />;
    } else {
      const { token, role } = JSON.parse(cookie);
      if (token === undefined || role !== "admin") {
        return <Redirect to="/ec-login" />;
      } else {
        return true;
      }
    }
  }

  login = (data, history) => {
    const { ec, token } = data;
    this.setToken(ec, token);
    localStorage.setItem("ecDetails", JSON.stringify(ec));
    this.intervalId = setInterval(() => {
      this.refreshToken(ec);
    }, 29 * 60 * 1000);
    history.replace("/ec-dashboard");
  };

  setToken = (ec, token) => {
    const { role } = ec;
    Cookies.set(
      this.token_name,
      { token, role },
      {
        path: "/",
      }
    );
  };

  getNewToken = async (oldToken) => {
    const url = "https://ovs-backend.herokuapp.com/ec/refresh-token";
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

  refreshToken = async (ec) => {
    const token = await this.getNewToken();
    this.setToken(ec, token);
  };

  logout = (history) => {
    Cookies.remove(this.token_name);
    localStorage.removeItem("ecDetails");
    clearInterval(this.intervalId);
    history.replace("/ec-login");
  };

  getToken = () => {
    const cookie = Cookies.get(this.token_name);
    const token = cookie !== undefined ? JSON.parse(cookie).token : "";
    return token;
  };
}

export default new AuthencticateEc();
