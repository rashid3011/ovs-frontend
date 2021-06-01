import { withRouter } from "react-router";
import "./index.css";
const Dashboardheader = (props) => {
  const {
    isNavbarVisible,
    isProfileVisible,
    name,
    logout,
    toggleProfile,
    toggleNavbar,
    history,
  } = props;
  const classMenu = isNavbarVisible ? "hide" : "";
  const classUserProfile = isProfileVisible ? "" : "hide-profile";
  return (
    <div className={`nav-menubars-container`}>
      <i
        className={`fas fa-bars nav-menu ${classMenu}`}
        onClick={toggleNavbar}
      ></i>
      <div className={`dash-header-right-outer ${classMenu}`}>
        <div className="toggle-profile" onClick={toggleProfile}>
          <i className="far fa-user-circle profile-icon"></i>
          <i className="fas fa-sort-down profile-arrow"></i>
        </div>
        <div className={`dash-header-right ${classUserProfile}`}>
          <p className="welcome">
            Welcome {name.slice(0, 1).toUpperCase() + name.slice(1)}
          </p>
          <button
            className="logout about-us"
            onClick={() => {
              history.push("/about-us");
            }}
          >
            About Us
          </button>
          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Dashboardheader);
