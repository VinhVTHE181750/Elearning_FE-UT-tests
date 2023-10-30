import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './ViewUser.css'; // Import your custom CSS file

const ViewUser = () => {
  const { username } = useParams();
  const [user, setUser] = useState([]);
  useEffect(() => {
    authApi
      .getUserByEmail(username)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {});
  }, [username]);

  console.log(user);
  return (
    <div className="view-user-container">
      <h1>User Details</h1>

      <div className="user-details">
        <p>
          <span className="label">Full Name:</span> {user.fullName}
        </p>
        <p>
          <span className="label">Username:</span> {user.username}
        </p>
        <p>
          <span className="label">Email:</span> {user.email}
        </p>
        <p>
          <span className="label">Gender:</span> {user.gender}
        </p>
        <p>
          <span className="label">Phone:</span> {user.phone}
        </p>
        <p>
          <span className="label">DOB:</span> {user.date_of_birth}
        </p>
        <p>
          <span className="label">Status:</span> {user.status}
        </p>
      </div>
    </div>
  );
};

export default ViewUser;
