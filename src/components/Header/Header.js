import React, { useEffect, useState } from 'react';
import './index.css';
import logo from '../../assets/images/logo_fpt.png';
import user_icon from '../../assets/images/user_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export default function Header() {
  const [searchText, setSearchText] = useState('');
  const [isSignIn, setIsSignIn] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var decoded = jwtDecode(userString);
      setRole(decoded.userInfo[0]);
      setIsSignIn(true);
    }
  }, []);

  const handleUserMenuClick = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsSignIn(false);
    navigate('/home');
  };

  return (
    <div className="header">
      <div className="header-logo">
        <Link to="/">
          <img src={logo} />
        </Link>
      </div>
      <div className="header-categories">
        <Link to="/allCourse">All Course</Link>
      </div>
      <div className="header-search">
        <input type="text" placeholder="Search" onChange={(e) => setSearchText(e.target.value)} />
        <button type="button" className="buttonSearch">
          <i className="bi bi-search">Search</i>
        </button>
      </div>
      <div className="header-options">
        {isSignIn ? (
          <>
            <Link to="/myCourse">My learning</Link>
            <Link to="">
              <img src={user_icon} onClick={handleUserMenuClick} />
              <div className="user-menu" style={{ display: userMenuVisible ? 'flex' : 'none' }}>
                <Link to="/profile">My Profile</Link>
                <Link to="/dashboard" style={{ display: role === 'TEACHER' ? 'flex' : 'none' }}>
                  Teacher
                </Link>
                <Link to="/myPayment">My payment</Link>
                <Link to="/changePassword">Change Password</Link>
                <Link to="/setting">Setting</Link>
                <Link to="/" onClick={handleLogout}>
                  Logout
                </Link>
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In/Sign Up</Link>
          </>
        )}
      </div>
    </div>
  );
}
