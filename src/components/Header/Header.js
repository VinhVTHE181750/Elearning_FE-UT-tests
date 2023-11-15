import React, { useEffect, useState } from 'react';
import './index.css';
import logo from '../../assets/images/logo_fpt.png';
import user_icon from '../../assets/images/user_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import authApi from '../../api/authApi';

export default function Header() {
  const [searchText, setSearchText] = useState('');
  const [isSignIn, setIsSignIn] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [gender, setGender] = useState('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var decoded = jwtDecode(userString);
      setRole(decoded.userInfo[0]);
      setUser(decoded.sub);
      setIsSignIn(true);
    }
  }, []);

  useEffect(() => {
    const getUserByUsername = async () => {
      if (user) {
        try {
          const response = await authApi.getUserByUserName(user);
          setEmail(response.data.user.email);
          setFullName(response.data.user.fullName);
          setPhoneNum(response.data.user.phone);
          setGender(response.data.user.gender);
          setDateOfBirth(response.data.user.date_of_birth);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    getUserByUsername();
  }, [user]);

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
      <div className="header-options">
        <Link to="/allCourse">All Course</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/chatgpt">ChatGPT</Link>
        {isSignIn ? (
          <>
            <Link to="/myLearning">My learning</Link>
            <div className="header-greeting" style={{ marginLeft: '30px' }}>
              Hello, {fullName}
            </div>
            <Link to="">
              <img src={user_icon} onClick={handleUserMenuClick} />
              <div className="user-menu" style={{ display: userMenuVisible ? 'flex' : 'none' }}>
                <Link to="/profile">My Profile</Link>
                <Link to="/myPayment">My payment</Link>
                <Link to="/dashboard" style={{ display: role === 'ADMIN' ? 'flex' : 'none' }}>
                  Admin dashboard
                </Link>
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
