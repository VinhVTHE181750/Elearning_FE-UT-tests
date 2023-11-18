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
  const [errorMessages, setErrorMessages] = useState({
    fullNameError: '',
    phoneNumError: '',
    dobError: '',
  });
  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      const decoded = jwt_decode(userString);
      setUser(decoded.sub);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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

  const isValidFullName = (name) => {
    const pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/; // Biểu thức chính quy để kiểm tra tên đầy đủ
    return pattern.test(name);
  };
  const phoneRegex = /^0\d{9}$/;

  const handleSave = async () => {
    const errors = {
      fullNameError: '',
      phoneNumError: '',
      dobError: '',
    };

    if (!fullName.trim()) {
      errors.fullNameError = 'Full name cannot be blank.';
    } else if (!isValidFullName(fullName)) {
      errors.fullNameError = 'Full name should contain only letters and spaces.';
    }

    if (!phoneNum.trim()) {
      errors.phoneNumError = 'Phone number cannot be blank.';
    } else {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phoneNum)) {
        errors.phoneNumError = 'Phone number should start with 0 and contain 10 digits.';
      }
    }

    if (!isValidDateOfBirth(dateOfBirth)) {
      errors.dobError = 'Date of birth must be at least 15 years ago.';
    }

    setErrorMessages(errors);

    if (Object.values(errors).some((error) => error !== '')) {
      setShowSuccessAlert(false);
      setShowErrorAlert(true); // Hiển thị thông báo lỗi
      return;
    }

    try {
      const trimmedFullName = fullName.trim();
      const params = {
        username: user,
        fullName: trimmedFullName,
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

  const renderErrorMessages = () => {
    return Object.values(errorMessages).map((message, index) => {
      if (message) {
        return <div key={index} style={{ color: 'red' }}>{message}</div>;
      }
      return null;
    });
  };


  if (!user) {
    return <div>Loading...</div>;
  }
  const handleReset = () => {
    window.location.reload(); // Reload lại trang
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h2>My Profile</h2>
        {showSuccessAlert && <Alert severity="success">Change Profile Successful!</Alert>}
        {showErrorAlert && <Alert severity="error">Error changing profile!</Alert>}



        <label>Fullname:</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        {/* Hiển thị thông báo lỗi cho trường Fullname */}
        {errorMessages.fullNameError && <span style={{ color: 'red' }}>{errorMessages.fullNameError}</span>}
        <br />

        <label>Phone Number:</label>
        <input type="text" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
        {/* Hiển thị thông báo lỗi cho trường Phone Number */}
        {errorMessages.phoneNumError && <span style={{ color: 'red' }}>{errorMessages.phoneNumError}</span>}
        <br />

        <label>Gender:</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <br />
        <label>Date of Birth:</label>
        <input type="date" value={dateOfBirth} onChange={handleDateOfBirthChange} />
        {/* Hiển thị thông báo lỗi cho trường Date of Birth */}
        {errorMessages.dobError && <span style={{ color: 'red' }}>{errorMessages.dobError}</span>}
        <br />
        <button onClick={handleSave}>Save</button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <Footer />
    </>
  );
};

export default Profile;