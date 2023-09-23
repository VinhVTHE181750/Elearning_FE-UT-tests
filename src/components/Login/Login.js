import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import user_icon from '../Asset/person.png';
import email_icon from '../Asset/email.png';
import password_icon from '../Asset/password.png';
import phone_icon from '../Asset/phone.png';
import gender_icon from '../Asset/gender.png';
import fullname_icon from '../Asset/fullname.png';
import dob_icon from '../Asset/dob.png';

import './LoginSignup.css';
const Login = (props) => {
  const [action, setAction] = useState('Login');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === 'Login' ? (
          <div></div>
        ) : (
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="User Name" />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder="Youremail@gmail.com" />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="PassWord" />
        </div>
      </div>

      {action === 'Sign Up' ? (
        <>
          <div className="input">
            <img src={fullname_icon} alt="" />
            <input type="text" placeholder="Full Name" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input">
            <img src={phone_icon} alt="" />
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="input">
            <img src={gender_icon} alt="" />
            <input type="text" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
          </div>
          <div className="input">
            <img src={dob_icon} alt="" />
            <input type="text" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" placeholder="Re-Password" />
          </div>
        </>
      ) : (
        <div className="forgot-password">
          <Link to="/forget">
            Lost Password? <span>Click here</span>
          </Link>
        </div>
      )}

      <div className="submit-container">
        <div
          className={action === 'Login' ? 'submit gray' : 'submit'}
          onClick={() => {
            setAction('Sign Up');
          }}
        >
          Sign Up
        </div>
        <div
          className={action === 'Sign Up' ? 'submit gray' : 'submit'}
          onClick={() => {
            setAction('Login');
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default Login;
