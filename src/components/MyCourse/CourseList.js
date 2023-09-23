import React from 'react';
import CourseData from './CourseData'; // Import the course data
import './Course.css';
const CourseList = () => {
  return (
    <div className="course-list">
      {CourseData.map((course) => (
        <div className="course-card" key={course.id}>
          <img src={course.image} alt={course.title} />
          <h3>{course.title}</h3>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
