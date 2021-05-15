import "./index.css";
import { Link } from "react-router-dom";

const SideBar = (props) => {
  const { isNavbarVisible, navLinks, toggleNavbar } = props;
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
            return (
              <Link
                to={`/${key}`}
                className="navlink"
                key={key}
                style={{ textDecoration: "none" }}
              >
                <li>{value}</li>
              </Link>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
