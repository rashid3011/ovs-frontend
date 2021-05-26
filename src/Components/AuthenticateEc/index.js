import Cookies from "js-cookie";

class AuthencticateEc {
  token_name = "ovsec";
  intervalId = null;

  authenticate = () => {
    if (this.getToken() === null || this.getRole() !== "admin") {
      return false;
    } else {
      this.refreshToken();
      this.createRefreshTokenInterval();
      return true;
    }
  };

  login = (data, history) => {
    const { ec, token } = data;
    this.setToken(token);
    localStorage.setItem("ecDetails", JSON.stringify(ec));
    this.createRefreshTokenInterval();
    history.replace("/ec-dashboard");
  };

  createRefreshTokenInterval = () => {
    this.intervalId = setInterval(() => {
      this.refreshToken();
    }, 29 * 60 * 1000);
  };

  setToken = (token) => {
    const role = "admin";
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

  refreshToken = async () => {
    const token = await this.getNewToken();
    this.setToken(token);
  };

  logout = (history) => {
    Cookies.remove(this.token_name);
    localStorage.removeItem("ecDetails");
    clearInterval(this.intervalId);
    history.replace("/ec-login");
  };

  getToken = () => {
    const cookie = Cookies.get(this.token_name);
    const token = cookie !== undefined ? JSON.parse(cookie).token : null;
    return token;
  };

  getRole = () => {
    const cookie = Cookies.get(this.token_name);
    const role = cookie !== undefined ? JSON.parse(cookie).role : null;
    return role;
  };
}

export default new AuthencticateEc();
