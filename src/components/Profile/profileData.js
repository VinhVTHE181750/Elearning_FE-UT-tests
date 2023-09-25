// ProfileData.js
import React from 'react';

const ProfileData = ({ data }) => {
  return (
    <div>
      <img src={data.avatar} alt="Avatar" />
      <h2>{data.name}</h2>
      <p>{data.bio}</p>
      <h3>Kỹ năng:</h3>
      <ul>
        {data.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileData;
