import Cookies from "js-cookie";

class AuthenticateVoter {
  token_name = "ovsvoter";
  intervalId = null;

  authenticate = () => {
    if (this.getToken() === null || this.getRole() !== "voter") {
      return false;
    } else {
      this.refreshToken();
      this.createRefreshTokenInterval();
      return true;
    }
  };

  verifyToken = async () => {
    const token = this.getToken();
    const voterDetails = localStorage.getItem("voterDetails");
    if (voterDetails === null) {
      return false;
    }
    const { voterId } = JSON.parse(voterDetails);
    const url = `https://ovs-backend.herokuapp.com/verified/${voterId}`;
    const options = {
      method: "GET",

      headers: {
        Authorization: `bearer ${token}`,
      },
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      return true;
    }
    return false;
  };

  createRefreshTokenInterval = () => {
    this.intervalId = setInterval(() => {
      this.refreshToken();
    }, 29 * 60 * 1000);
  };

  refreshToken = async () => {
    const token = await this.getNewToken();
    this.setToken(token);
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
    this.setToken(token);
    history.replace("/voter-dashboard");
  };

  setToken = (token) => {
    const role = "voter";
    Cookies.set(
      this.token_name,
      { token, role },
      {
        path: "/",
      }
    );
  };

  logout = (history) => {
    clearInterval(this.intervalId);
    Cookies.remove(this.token_name);
    localStorage.removeItem("voterDetails");
    history.replace("/voter-login");
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

export default new AuthenticateVoter();
