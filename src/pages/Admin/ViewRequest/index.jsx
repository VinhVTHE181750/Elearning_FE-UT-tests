import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataUser } from '../../../data/dataUser';
import './ViewUser.css'; // Import your custom CSS file

const ViewUser = () => {
  const { userId } = useParams();
  const [userToView, setUserToView] = useState(null);
  const negative = useNavigate();

  // Find user information based on userId
  useEffect(() => {
    const user = dataUser.find((user) => user.id === parseInt(userId));
    setUserToView(user);
  }, [userId]);

  if (!userToView) {
    return <div>User not found</div>;
  }

  return (
    <div className="view-user-container">
      <h1>User Details</h1>

      <div className="user-details">
        <p>
          <span className="label">Full Name:</span> {userToView.fullName}
        </p>
        <p>
          <span className="label">Username:</span> {userToView.username}
        </p>
        <p>
          <span className="label">Email:</span> {userToView.email}
        </p>
        <p>
          <span className="label">Gender:</span> {userToView.gender}
        </p>
        <p>
          <span className="label">Phone:</span> {userToView.phone}
        </p>
        <p>
          <span className="label">DOB:</span> {userToView.dob}
        </p>
        <p>
          <span className="label">Status:</span> {userToView.status}
        </p>
      </div>
    </div>
  );
};

export default ViewUser;
