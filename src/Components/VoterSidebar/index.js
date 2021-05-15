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
    details,
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
            const { key, value } = link;
            return key !== "delete-account" ? (
              <Link
                to={`/${key}`}
                className="navlink"
                key={key}
                style={{ textDecoration: "none" }}
              >
                <li>{value}</li>
              </Link>
            ) : (
              <Popup
                trigger={<li className="navlink">{value}</li>}
                className="delete-user-popup"
                position="right center"
                modal
                key={key}
              >
                {(close) => {
                  return isDeletingVoter
                    ? renderDeleteConfirmed()
                    : renderDeleteConfirmation(details, close);
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
