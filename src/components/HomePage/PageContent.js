import React from 'react';
import CourseData from '../MyCourse/CourseData';
import './home.css';
const PageContent = () => {
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

export default PageContent;
