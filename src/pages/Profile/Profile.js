import React, { useEffect, useState } from 'react';
import authApi from '../../api/authApi';
import jwt_decode from 'jwt-decode';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [gender, setGender] = useState('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
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
          console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        }
      }
    };

    getUserByUsername();
  }, [user]);

  const handleSave = async () => {
    try {
      const params = {
        username: user,
        fullName: fullName,
        phoneNum: phoneNum,
        gender: gender,
        dateOfBirth: dateOfBirth,
      };
      const response = await authApi.changeProfile(params);
      console.log(response);
      window.alert(`Change profile: ${response.message}`);
    } catch (error) {
      window.alert('Change profile error!');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Header />
      <h2>My Profile</h2>

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
      <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />

      <button onClick={handleSave}>Save</button>
      <Footer />
    </div>
  );
};

export default Profile;
