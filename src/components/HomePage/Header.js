import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import logo_icon from '../Asset/logo_icon.png';
const Header = () => {
  return (
    <header>
      <div className="header-logo">
        <img src={logo_icon} alt="Logo" />
      </div>
      <div className="header-search">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
      <div className="content-header">
        <Link to="/courses">My Course </Link>
      </div>
      <div className="header-login">
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
