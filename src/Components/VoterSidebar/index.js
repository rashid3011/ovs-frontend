import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "./index.css";

const VoterSidebar = (props) => {
  const {
    isNavbarVisible,
    navLinks,
    toggleNavbar,
    isDeletingVoter,
    renderDeleteConfirmed,
    renderDeleteConfirmation,
  } = props;
  const classNavbar = isNavbarVisible ? "" : "hide-navbar";

  return (
    <div className={`sidebar-container ${classNavbar}`}>
      <i
        className="fas fa-chevron-circle-left close-icon"
        onClick={toggleNavbar}
      ></i>
      <nav className="sidebar">
        <ul className="nav-list">
          {navLinks.map((link) => {
            const { key, value, icon } = link;
            return key !== "delete-account" ? (
              <Link
                to={`/${key}`}
                className="navlink"
                key={key}
                style={{ textDecoration: "none" }}
              >
                <i className={`fas fa-${icon}`}></i>
                <li>{value}</li>
              </Link>
            ) : (
              <Popup
                trigger={
                  <li className="navlink">
                    <i className={`fas fa-${icon}`}></i>
                    {value}
                  </li>
                }
                className="delete-user-popup voter-delete-user-popup"
                position="right center"
                modal
                key={key}
              >
                {(close) => {
                  return isDeletingVoter
                    ? renderDeleteConfirmed()
                    : renderDeleteConfirmation(close);
                }}
              </Popup>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default VoterSidebar;
