import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
import Sidebar from '../../../components/Sidebar/Sidebar';

const EditLesson = () => {
  const { lessonID } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState(null);
  const [editedLesson, setEditedLesson] = useState({
    lessonID: lessonID,
    lessonName: '',
    ordNumber: 0,
    courseID: null,
    linkContent: '',
    description: '',
  });
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    // Gọi API để lấy dữ liệu của bài học dựa trên lessonID
    authApi
      .findAllLesson()
      .then((response) => {
        const lessonArray = (response.data && response.data.listLesson) || [];
        console.log(lessonArray);
        const selectedLesson = lessonArray.find((lesson) => Number(lesson.id) === Number(lessonID));
        console.log(selectedLesson);
        if (selectedLesson) {
          setEditedLesson({
            lessonID: lessonID,
            lessonName: selectedLesson.name,
            ordNumber: selectedLesson.ordNumber,
            courseID: selectedLesson.courseID,
            linkContent: selectedLesson.linkContent,
            description: selectedLesson.description,
          });
        } else {
          console.error('Lesson not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching lesson data:', error);
      });
    authApi
      .findAllCourse()
      .then((response) => {
        const courseArray = (response.data && response.data.listCourse) || [];
        setCourses(courseArray);
      })
      .catch((error) => {
        console.error('Error fetching course data:', error);
      });
  }, [lessonID]);
  const handleSaveClick = () => {
    const params = {
      lessonID: lessonID,
      lessonName: editedLesson.lessonName,
      ordNumber: editedLesson.ordNumber,
      courseID: editedLesson.courseID,
      linkContent: editedLesson.linkContent,
      description: editedLesson.description,
    };

    // Call API to update lesson
    authApi
      .updateLesson(params)
      .then((response) => {
        // Handle success
        setSuccessMessage('Lesson updated successfully.');
      })
      .catch((error) => {
        // Handle error
        setErrorMessage('Failed to update lesson.');
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          <h2>Edit Lesson</h2>
          <div className="form-group">
            <label className="label">Lesson Name:</label>
            <input
              type="text"
              value={editedLesson.lessonName}
              onChange={(e) => setEditedLesson({ ...editedLesson, lessonName: e.target.value })}
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Order Number:</label>
            <input
              type="number"
              value={editedLesson.ordNumber}
              onChange={(e) => setEditedLesson({ ...editedLesson, ordNumber: parseInt(e.target.value) })}
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Course ID:</label>
            <select
              value={editedLesson.courseID}
              onChange={(e) => setEditedLesson({ ...editedLesson, courseID: parseInt(e.target.value) })}
              className="input"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Link Content:</label>
            <input
              type="text"
              value={editedLesson.linkContent}
              onChange={(e) => setEditedLesson({ ...editedLesson, linkContent: e.target.value })}
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Description:</label>
            <input
              type="text"
              value={editedLesson.description}
              onChange={(e) => setEditedLesson({ ...editedLesson, description: e.target.value })}
              className="input"
            />
          </div>
          <button type="submit" onClick={handleSaveClick} className="button">
            Save
          </button>{' '}
          {/* Apply button class */}
          {successMessage && <div className="success-message">{successMessage}</div>}{' '}
          {/* Apply success-message class */}
          {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Apply error-message class */}
        </div>
      </div>
    </div>
  );
};

export default EditLesson;
