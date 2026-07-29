import "./Header.css";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header({ toggleSidebar }) {
  return (
    <header className="header">

      <div className="header-left">

       <button
            className="menu-btn"
            onClick={toggleSidebar}
            >
            <FaBars />
        </button>

        <div className="logo">
          <h2>NexHire</h2>
          <span>AI Recruitment Platform</span>
        </div>

      </div>

      <div className="header-right">

        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="register-btn">
          Register
        </Link>

      </div>

    </header>
  );
}

export default Header;