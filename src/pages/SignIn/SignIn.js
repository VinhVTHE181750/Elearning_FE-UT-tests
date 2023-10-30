import React, { useState } from 'react';
import './index.css';
import logo from '../../assets/images/logo_fpt.png';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBCol,
  MDBRow,
  MDBInput,
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import moment from 'moment';
import jwtDecode from 'jwt-decode';

export default function SignIn() {
  const [justifyActive, setJustifyActive] = useState('tab1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9]+[@]([a-z]+[.]){1,2}[a-z]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const phoneRegex = /^0\d{9}$/;

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const handleSignIn = () => {
    const data = {
      username: email,
      password: password,
    };
    if (email === '' && password === '') return;
    if (!emailRegex.test(email)) {
      return window.alert('Email invalidate');
    }
    if (!passwordRegex.test(password)) {
      return window.alert('Password must be at least 8 characters and uppercase, lowercase letter, number');
    }
    authApi
      .login(data)
      .then((response) => {
        if (response.code === 0) {
          localStorage.setItem('user-access-token', response.data.accessToken);
          var decoded = jwtDecode(response.data.accessToken);
          localStorage.setItem('role', decoded.userInfo[0]);
          navigate('/home');
          return;
        } else {
          return window.alert(`Login Failed: ${response.message}`);
        }
      })
      .catch((error) => {
        return window.alert(`Login Failed`);
      });
  };
  const handleSignUp = () => {
    const data = {
      email,
      password,
      fullName,
      phone,
      gender,
      dateOfBirth: dob,
    };
    if (email === '' || password === '' || fullName === '' || phone === '' || dob === '') return;
    if (!emailRegex.test(email)) {
      return window.alert('Error: Email invalidate');
    }
    if (!passwordRegex.test(password)) {
      return window.alert('Error: Password must be at least 8 characters and uppercase, lowercase letter, number');
    }
    if (password !== rePassword) {
      return window.alert('Error: Confirm password not equal password');
    }
    if (!phoneRegex.test(phone)) {
      return window.alert('Error: Phone is a 10-digit number sequence that starts with 0');
    }
    if (parseInt(moment().year()) - parseInt(moment(dob).year()) < 15) {
      return window.alert('Error: Must be older than 15 years old and calculated in years');
    }
    authApi
      .register(data)
      .then((response) => {
        console.log(response);
        if (response.code === 0) {
          localStorage.setItem('emailSignUp', email);
          navigate('/verifyOtp');
        } else {
          return window.alert(`Sign Up Error: ${response.data.message}`);
        }
      })
      .catch((error) => {
        return window.alert(`Sign Up Error: System Error`);
      });
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <img src={logo}></img>
      <MDBTabs pills justify className="mb-3 d-flex flex-row justify-content-between">
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
            SignIn
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
            SignUp
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={justifyActive === 'tab1'}>
          <MDBInput
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            wrapperClass="mb-4"
            label="Email address"
          />
          <MDBInput
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            wrapperClass="mb-4"
            label="Password"
          />
          <div className="d-flex justify-content-between mx-4 mb-4">
            <Link to="/forgotPassword">Forgot password?</Link>
          </div>

          <div className="button">
            <button
              onClick={() => {
                handleSignIn();
              }}
            >
              Sign In
            </button>
          </div>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === 'tab2'}>
          <MDBInput
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setFullName(e.target.value)}
            wrapperClass="mb-4"
            label="Full Name"
          />

          <MDBInput
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            wrapperClass="mb-4"
            label="Email address"
          />
          <MDBRow>
            <MDBCol col="6">
              <MDBInput
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                wrapperClass="mb-4"
                label="Password"
              />
            </MDBCol>
            <MDBCol col="6">
              <MDBInput
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setRePassword(e.target.value)}
                wrapperClass="mb-4"
                label="Confirm password"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol col="6">
              <MDBInput
                type="text"
                placeholder="Enter your phone"
                onChange={(e) => setPhone(e.target.value)}
                wrapperClass="mb-4"
                label="Phone number"
              />
            </MDBCol>
            <MDBCol col="6">
              <MDBInput
                type="date"
                onChange={(e) => setDob(e.target.value)}
                wrapperClass="mb-4"
                label="Date of birth"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <div className="select">
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
                <br />
                <label>Gender</label>
              </div>
            </MDBCol>
          </MDBRow>

          <div className="button">
            <button
              onClick={() => {
                handleSignUp();
              }}
            >
              Sign Up
            </button>
          </div>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}
