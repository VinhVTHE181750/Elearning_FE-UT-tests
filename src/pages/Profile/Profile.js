import React, { useEffect, useState } from 'react';
import authApi from '../../api/authApi';
import jwt_decode from 'jwt-decode';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Alert } from '@mui/material';
import './profile.css';
const Profile = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [gender, setGender] = useState('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dobError, setDobError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  useEffect(() => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      const decoded = jwt_decode(userString);
      setUser(decoded.sub);
    }
  }, []);

  useEffect(() => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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

  const isValidDateOfBirth = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }
    return age >= 15;
  };

  const handleDateOfBirthChange = (e) => {
    const date = e.target.value;
    setDateOfBirth(date);
    if (!isValidDateOfBirth(date)) {
      setDobError('Date of birth must be at least 15 years ago');
    } else {
      setDobError('');
    }
  };

  const handleSave = async () => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    try {
      const params = {
        username: user,
        fullName: fullName,
        phoneNum: phoneNum,
        gender: gender,
        dateOfBirth: dateOfBirth,
      };
      const response = await authApi.changeProfile(params);
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
    } catch (error) {
      setShowSuccessAlert(false);
      setShowErrorAlert(true);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        {' '}
        {/* Add className here */}
        <h2>My Profile</h2>
        {showSuccessAlert && <Alert severity="success">Change Profile Successfull!</Alert>}
        {showErrorAlert && <Alert severity="error">Fail to Change Profile!</Alert>}
        <label>Fullname:</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <label>Phone Number:</label>
        <input type="text" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <br />
        <label>Date of Birth:</label>
        <input type="date" value={dateOfBirth} onChange={handleDateOfBirthChange} />
        {dobError && <span style={{ color: 'red' }}>{dobError}</span>}
        <button onClick={handleSave}>Save</button>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
