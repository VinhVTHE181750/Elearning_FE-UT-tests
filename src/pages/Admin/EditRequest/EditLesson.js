import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';
import { Alert } from '@mui/material';
import { Button } from 'antd';
const EditLesson = () => {
  const { lessonID } = useParams();

  const [username, setUsername] = useState('');
  const [editedLesson, setEditedLesson] = useState({
    lessonID: lessonID,
    lessonName: '',
    ordNumber: '',
    courseID: '',
    linkContent: '',
    description: '',
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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

  const handleSaveClick = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    console.log(editedLesson);
    const params = { ...editedLesson, username: jwtDecode(localStorage.getItem('user-access-token')).sub };
    console.log(params);
    authApi
      .updateLesson(params)
      .then((response) => {
        setShowSuccessAlert(true);
        setShowErrorAlert(false);
      })
      .catch((error) => {
        setShowSuccessAlert(false);
        setShowErrorAlert(true);
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          <h2>Edit Lesson</h2>
          {showSuccessAlert && (
            <Alert severity="success" sx={{ backgroundColor: 'lightblue', color: 'green' }}>
              Edit Lesson Successful!
            </Alert>
          )}
          {showErrorAlert && (
            <Alert severity="error" sx={{ backgroundColor: 'lightcoral' }}>
              Fail to Edit Lesson!
            </Alert>
          )}
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
          <div>
            <Button
              type="submit"
              onClick={handleSaveClick}
              className="button"
              style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
            >
              Save
            </Button>
            <Button
              onClick={() => (window.location.href = `/viewCourse/${editedLesson.courseID}`)}
              style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLesson;
