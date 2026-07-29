import "./Header.css";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

function Header({ openSidebar }) {
  return (
    <header className="admin-header">

      <div className="header-left">

        <button className="menu-btn" onClick={openSidebar} >
          <FaBars />
        </button>

        <h2>NexHire Admin</h2>

      </div>

      <div className="header-center">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>

      <div className="header-right">

        <button className="notification-btn">
          <FaBell />
          <span className="notification-dot"></span>
        </button>

        <div className="admin-profile">

          <FaUserCircle className="profile-icon"/>

          <div>

            <h4>Admin</h4>

            <p>Administrator</p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;