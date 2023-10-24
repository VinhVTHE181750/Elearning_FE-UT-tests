import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewCourse.css';
import authApi from '../../../api/authApi';
import AddQuiz from '../../../pages/Admin/AddRequest/AddQuiz';

const ViewCourse = () => {
  const { courseID } = useParams();
  const [courseToView, setCourseToView] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedLessons, setExpandedLessons] = useState([]);
  const [expandedQuizzes, setExpandedQuizzes] = useState([]);

  const navigate = useNavigate();
  // Find all course
  useEffect(() => {
    authApi
      .findAllCourse()
      .then((response) => {
        const courseArray = (response.data && response.data.listCourse) || [];
        const courseToView = courseArray.find((course) => course.id === parseInt(courseID));
        setCourseToView(courseToView);
      })
      .catch((error) => {
        console.error('Error fetching course data:', error);
      });
  }, [courseID]);
  // find all lesson
  useEffect(() => {
    authApi
      .findAllLesson()
      .then((response) => {
        const lessonArray = (response.data && response.data.listLesson) || [];
        setLessons(lessonArray);
      })
      .catch((error) => {
        console.error('Error fetching lesson data:', error);
      });
  }, []);
  // find all quiz

  useEffect(() => {
    authApi
      .findAllQuiz()
      .then((response) => {
        const quizArray = (response.data && response.data.quizList) || [];
        console.log('Data của quizArray:', quizArray);

        setQuizzes(quizArray);
      })
      .catch((error) => {
        console.error('Error fetching quiz data:', error);
      });
  }, []);

  useEffect(() => {
    console.log('Data của quizzes:', quizzes);
    // Thực hiện các hành động cần thiết sau khi dữ liệu đã được cập nhật
  }, [quizzes]);

  const handleAddLesson = () => {
    navigate('/add-lesson');
  };
  const handleDeleteLesson = (lessonID) => {
    const lessonToDelete = lessons.find((lesson) => lesson.id === parseInt(lessonID));
    if (lessonToDelete) {
      setSelectedLessonId(lessonToDelete.id);
      if (window.confirm('Do you want to delete this lesson?')) {
        authApi
          .deleteLesson(lessonID)
          .then((response) => {
            if (response.data && response.code === 0) {
              setSuccessMessage('Delete Successfully!');
              // Remove the deleted lesson from the lessons state
              setLessons(lessons.filter((lesson) => lesson.id !== lessonID));

              setLessons((prevLessons) =>
                prevLessons.map((lesson, index) => ({
                  ...lesson,
                  id: index + 1,
                })),
              );
            } else {
              setErrorMessage('Delete Failed!');
            }
          })
          .catch((error) => {
            setErrorMessage('Function Delete Failed!');
            console.log('');
          });
      }
    }
  };

  const handleEditLesson = (id) => {
    navigate(`/edit-lesson/${id}`);
  };
  const handleViewLesson = (id) => {
    navigate(`/viewLesson/${id}`);
  };

  const handleEditQuiz = (id) => {
    navigate(`/edit-quiz/${id}`);
  };

  const handleDeleteQuiz = (quizID) => {
    const quizToDelete = quizzes.find((quiz) => quiz.id === parseInt(quizID));
    if (quizToDelete) {
      setSelectedQuizId(quizToDelete.id);
      if (window.confirm('Do you want to delete this quiz?')) {
        authApi
          .deleteQuiz(quizID)
          .then((response) => {
            if (response.data && response.code === 0) {
              setSuccessMessage('Delete Successfully!');
              // Remove the deleted quiz from the quizzes state
              setQuizzes(quizzes.filter((quiz) => quiz.id !== quizID));

              setQuizzes((prevQuizzes) =>
                prevQuizzes.map((quiz, index) => ({
                  ...quiz,
                  id: index + 1,
                })),
              );
            } else {
              setErrorMessage('Delete Failed!');
            }
          })
          .catch((error) => {
            setErrorMessage('Function Delete Failed!');
            console.log('');
          });
      }
    }
  };
  const handleViewQuiz = (id) => {
    navigate(`/view-quiz/${id}`);
  };
  const handleAddQuiz = (id) => {
    navigate(`/add-quiz/${id}`);
  };

  return (
    <div className="view-course-container">
      {courseToView ? (
        <div>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <h1>Course Details</h1>
          <div className="course-details">
            <p>
              <span className="label">Name:</span> {courseToView.name}
            </p>
            <p>
              <span className="label">Description:</span> {courseToView.description}
            </p>
            <p>
              <span className="label">Category:</span> {courseToView.category.name}
            </p>
            <p>
              <span className="label">Created:</span> {courseToView.createdAt}
            </p>
            <p>
              <span className="label">Price:</span> {courseToView.price}
            </p>
          </div>
        </div>
      ) : (
        <div>Loading course details...</div>
      )}
      <h2>List Lesson</h2>
      <button onClick={handleAddLesson}>Add Lesson</button>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id} className="lesson-item">
            <a>{lesson.description}</a>
            <div className="lesson-actions">
              <button onClick={() => handleEditLesson(lesson.id)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDeleteLesson(lesson.id)} className="delete-button">
                Delete
              </button>
              <button onClick={() => handleViewLesson(lesson.id)} className="view-button">
                View
              </button>
            </div>
            <div className="button-group">
              <button onClick={() => handleAddQuiz(lesson.id)} style={{ color: 'black' }}>
                Add Quiz
              </button>
            </div>
            {quizzes.length > 0 ? (
              <ul>
                {quizzes.map((quiz) => {
                  if (quiz.lesson?.id === lesson.id) {
                    return (
                      <li key={quiz.id} style={{ color: 'black' }}>
                        {quiz.name}
                        <div className="quiz-actions">
                          <button onClick={() => handleEditQuiz(quiz.id)}>Edit</button>
                          <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                          <button onClick={() => handleViewQuiz(quiz.id)}>View</button>
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
            ) : (
              <p style={{ color: 'black' }}>No quizzes available.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewCourse;
