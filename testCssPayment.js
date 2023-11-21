import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';
import { Alert } from '@mui/material';
import { Button } from 'antd';

const EditLesson = () => {
  const { courseID } = useParams();
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
  const [errors, setErrors] = useState({
    lessonNameError: '',
    linkContentError: '',
    descriptionError: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('user-access-token');
    if (!token) {
      return (window.location.href = '/signin');
    }

    setUsername(jwtDecode(token).sub);

    authApi
      .getLessonById(lessonID)
      .then((response) => {
        setEditedLesson({
          ...editedLesson,
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
  }, [lessonID, username]);

  const isValidLessonName = (name) => {
    const nameRegex = /^[a-zA-Z0-9]+[A-Za-zÀ-ỹ0-9!@#$%^&*(),.?":{}|<>':\s]+$/;
    return nameRegex.test(name);
  };

  const isValidLinkContent = (content) => {
    const linkThumbnailRegex =
      /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return linkThumbnailRegex.test(content);
  };

  const handleSaveClick = () => {
    const newErrors = {
      lessonNameError: '',
      linkContentError: '',
      descriptionError: '',
    };
    console.log(editedLesson);
    const params = { ...editedLesson, username: jwtDecode(localStorage.getItem('user-access-token')).sub };
    console.log(params);
    if (!localStorage.getItem('user-access-token')) {
      return (window.location.href = '/signin');
    }

    if (!editedLesson.lessonName.trim()) {
      newErrors.lessonNameError = 'Error: Lesson Name cannot be blank!';
    } else if (!isValidLessonName(editedLesson.lessonName)) {
      newErrors.lessonNameError = 'Error: Lesson Name is invalid!';
    }

    if (!editedLesson.linkContent.trim()) {
      newErrors.linkContentError = 'Error: Link Content cannot be blank!';
    } else if (!isValidLinkContent(editedLesson.linkContent)) {
      newErrors.linkContentError = 'Error: Link Content is invalid!';
    }

    if (!editedLesson.description.trim()) {
      newErrors.descriptionError = 'Error: Description cannot be blank!';
    }

    if (newErrors.lessonNameError || newErrors.linkContentError || newErrors.descriptionError) {
      setErrors(newErrors);
      setShowSuccessAlert(false);
      setShowErrorAlert(true);
    } else {
      const params = {
        ...editedLesson,
        username: jwtDecode(localStorage.getItem('user-access-token')).sub,
      };

      authApi
        .updateLesson(params)
        .then((response) => {
          setShowSuccessAlert(true);
          setShowErrorAlert(false);
          navigate(`/viewCourse/${courseID}`);
        })
        .catch((error) => {
          setShowSuccessAlert(false);
          setShowErrorAlert(true);
        });
    }
  };

  const navigate = useNavigate();

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
            {errors.lessonNameError && <span className="error">{errors.lessonNameError}</span>}
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
            {errors.linkContentError && <span style={{ color: 'red' }}>{errors.linkContentError}</span>}
            <br />
          </div>
          <div className="form-group">
            <label className="label">Description:</label>
            <input
              type="text"
              value={editedLesson.description}
              onChange={(e) => setEditedLesson({ ...editedLesson, description: e.target.value })}
              className="input"
            />
            {errors.descriptionError && <span style={{ color: 'red' }}>{errors.descriptionError}</span>}
            <br />
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
              onClick={() => navigate(`/viewCourse/${editedLesson.courseID}`)}
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
