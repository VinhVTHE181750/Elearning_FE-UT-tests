import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './index.css';
import authApi from '../../api/authApi';

export default function PageContent() {
  const [allCourses, setAllCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách khoá học hàng đầu
    authApi
      .findAllCourse()
      .then((response) => {
        const sortedAllCourses = response.data.listCourse.sort((a, b) => a.price - b.price);

        // Lấy 5 khóa học hàng đầu
        const topAllCourses = sortedAllCourses.slice(0, 5);

        setAllCourses(topAllCourses);
      })
      .catch((error) => {
        console.error('Error fetching top courses:', error);
      });
  }, []);

  useEffect(() => {
    authApi
      .getNewestCourse()
      .then((response) => {
        const sortedNewCourses = response.data.listCourse.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Lấy 5 khóa học mới nhất
        const topNewCourses = sortedNewCourses.slice(0, 5);

        setNewCourses(topNewCourses);
      })
      .catch((error) => {
        console.error('Error fetching newest courses:', error);
      });
  }, []);

  return (
    <div className="page-content">
      <h2>Top Course</h2>
      <div className="course-list">
        {allCourses.map((course) => (
          <Link to={`/course/${course.name}`} key={course.id} className="course-card">
            <img
              src={
                'https://static.wixstatic.com/media/65246d_c7bd3ba476fb4191af59a11494ad027f~mv2.jpg/v1/fill/w_820,h_460,al_c,q_85/65246d_c7bd3ba476fb4191af59a11494ad027f~mv2.jpg'
              }
              alt={course.name}
            />
            <h3>{course.name}</h3>
            <p>Price: {course.price}</p>
          </Link>
        ))}
      </div>

      <h2>New Course</h2>
      <div className="course-list">
        {newCourses.map((course) => (
          <Link to={`/lesson/${course.id}`} key={course.id} className="course-card">
            <img
              src={
                'https://static.wixstatic.com/media/65246d_c7bd3ba476fb4191af59a11494ad027f~mv2.jpg/v1/fill/w_820,h_460,al_c,q_85/65246d_c7bd3ba476fb4191af59a11494ad027f~mv2.jpg'
              }
              alt={course.name}
            />
            <h3>{course.name}</h3>
            <p>Price: {course.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
