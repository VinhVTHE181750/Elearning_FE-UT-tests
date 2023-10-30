import React, { useState, useEffect } from 'react';
import './index.css';
import authApi from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { MDBBtn, MDBContainer, MDBInput, MDBTabs, MDBTabsContent, MDBTabsItem, MDBTabsLink } from 'mdb-react-ui-kit';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [user, setUser] = useState(null);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      setUser(userString);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      oldPassword: currentPassword,
      newPassword: newPassword,
      reNewPassword: confirmNewPassword,
    };
    if (user === null) {
      localStorage.clear();
      navigate('/signin');
    }
    if (!passwordRegex.test(currentPassword)) {
      return window.alert(
        'Current Password Error: Password must be at least 8 characters and uppercase, lowercase letter, number',
      );
    }
    if (!passwordRegex.test(newPassword)) {
      return window.alert(
        'New Password Error: Password must be at least 8 characters and uppercase, lowercase letter, number',
      );
    }
    if (newPassword !== confirmNewPassword) {
      return window.alert('Confirm New Password Error: New password not equal confirm new password');
    }
    authApi
      .changePassword(data)
      .then((response) => {
        if (response.code === 0) {
          return window.alert('Change Password Successfully');
        } else {
          return window.alert('Current Password not correct');
        }
      })
      .catch((error) => {
        return window.alert('Change Password System Error');
      });
  };

  return (
    <div>
      <Header />
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
        <h2>Change Password</h2>
        <MDBTabsContent>
          <MDBInput
            type="password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            label="Current Password"
          />
          <MDBInput
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label="New Password"
          />
          <MDBInput
            type="password"
            placeholder="Enter your confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            label="Confirm New Password"
          />
        </MDBTabsContent>
        <MDBBtn onClick={handleSubmit}>Change Password</MDBBtn>
      </MDBContainer>
    </div>
  );
}
