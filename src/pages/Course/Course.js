import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import './index.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import jwtDecode from 'jwt-decode';

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const [lesson, setLesson] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .getCourseById(id)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error('Error fetching course by id:', error);
      });
  }, [id]);

  useEffect(() => {
    if (course) {
      authApi
        .getLessonByCourseId(course.id)
        .then((response) => {
          const lessonArray = (response.data && response.data.lessonList) || [];
          setLesson(lessonArray);
        })
        .catch((error) => {
          console.error('Error fetching lesson by id:', error);
        });
    }
  }, [course]);
  if (!course) {
    return <div className="not-found">Course not found</div>;
  }

  const handleViewLesson = (item) => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      return navigate(`/viewLesson/${item.id}`);
    } else return navigate('/signin');
  };

  return (
    <>
      <Header />
      <div className="course-details" style={{ marginTop: '50px', marginBottom: '150px' }}>
        <h2>{course.name}</h2>
        <img src={course.linkThumnail} alt={course.name} />
        <p>{course.description}</p>
        <p className="price">Price: {course.price}</p>

        {lesson && (
          <div className="lesson-container">
            {lesson.map((item, index) => (
              <div key={index} className="lesson-details">
                <h4 onClick={() => handleViewLesson(item)}>
                  Lesson {index + 1}: {item.name}
                </h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
