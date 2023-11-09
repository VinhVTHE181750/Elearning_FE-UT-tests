import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';

const EditLesson = () => {
  const { lessonID } = useParams();

  const [username, setUsername] = useState('');
  const [editedLesson, setEditedLesson] = useState({
    username: username,
    lessonID: lessonID,
    lessonName: '',
    ordNumber: '',
    courseID: '',
    linkContent: '',
    description: '',
  });

  useEffect(() => {
    if (localStorage.getItem('user-access-token')) {
      setUsername(jwtDecode(localStorage.getItem('user-access-token')).sub);
    }
  }, [localStorage.getItem('user-access-token')]);
  useEffect(() => {
    authApi
      .getLessonById(lessonID)
      .then((response) => {
        setEditedLesson({
          username: username,
          lessonID: lessonID,
          lessonName: response.data.name,
          ordNumber: response.data.ordNumber,
          courseID: response.data.course.id,
          linkContent: response.data.linkContent,
          description: response.data.description,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [lessonID]);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleSaveClick = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    if (localStorage.getItem('user-access-token')) {
      setEditedLesson({ ...editedLesson, username: jwtDecode(localStorage.getItem('user-access-token')).sub });
    }
    console.log(editedLesson);
    authApi
      .updateLesson(editedLesson)
      .then((response) => {
        setSuccessMessage('Lesson updated successfully.');
      })
      .catch((error) => {
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
