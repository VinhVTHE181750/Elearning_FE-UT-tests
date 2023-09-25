// Profile.js
import React from 'react';
import ProfileData from './profileData';
import './profile.css';
const Profile = () => {
  const ProfileData = {
    avatar:
      'https://kenh14cdn.com/thumb_w/660/2018/12/10/vn15be5bfa0b8c374219d12359t0921e690-1544393983564565645256.jpg',
    name: 'Nguyen Hoang Minh',
    bio: 'Frontend Developer',
    skills: ['HTML,CSS', 'Reactjs', 'javaScript'],
  };

  return (
    <div className="profile-container">
      {' '}
      {/* Sử dụng lớp CSS */}
      <img src={ProfileData.avatar} alt="Avatar" className="profile-avatar" />
      <h2 className="profile-name">{ProfileData.name}</h2>
      <p className="profile-bio">{ProfileData.bio}</p>
      <h3 className="profile-skills">Kỹ năng:</h3>
      <ul>
        {ProfileData.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
