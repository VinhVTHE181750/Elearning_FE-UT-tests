import React, { useState } from 'react';
import './add.css';
import authApi from '../../../api/authApi';
import { useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@mui/material';
import { Button } from 'antd';

function AddLesson() {
  const [lessonName, setLessonName] = useState('');
  const [ordNumber, setOrdNumber] = useState(0);
  const { courseID } = useParams();
  const [linkContent, setLinkContent] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    if (localStorage.getItem('user-access-token')) {
      setUsername(jwtDecode(localStorage.getItem('user-access-token')).sub);
    }
  }, [localStorage.getItem('user-access-token')]);

  const nameRegex = /^[a-zA-Z0-9]+[A-Za-zÀ-ỹ0-9!@#$%^&*(),.?":{}|<>':\s]+$/;
  const linkThumbnailRegex =
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

  const handleSubmit = (e) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    if (!nameRegex.test(lessonName.trim())) return window.alert('Error: Lesson Name invalidate!');
    if (!linkThumbnailRegex.test(linkContent)) return window.alert('Error: Link Content error!');
    if (!nameRegex.test(description.trim())) return window.alert('Error: Description invalidate!');
    e.preventDefault();
    if (lessonName && ordNumber && linkContent && description) {
      const params = {
        username: username,
        lessonName,
        ordNumber,
        courseID: courseID,
        linkContent,
        description,
      };
      console.log(params);
      authApi.addLesson(params).then((response) => {
        setShowSuccessAlert(true);
        setShowErrorAlert(false);
        navigate(`/viewCourse/${courseID}`);
      });
      // Đăng kí thành công
    } else {
      // Đăng kí thất bại
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
    }
  };
  const handleBackClick = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate('/manageCourse');
  };
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-lesson-container">
          <h1>Add Lesson</h1>
          {showSuccessAlert && (
            <Alert severity="success" sx={{ backgroundColor: 'aquamarine', color: 'green' }}>
              Add Lesson Successful!
            </Alert>
          )}
          {showErrorAlert && (
            <Alert severity="error" sx={{ backgroundColor: 'lightcoral' }}>
              Fail to Add Lesson!
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <label>
              Lesson Name:
              <input type="text" value={lessonName} onChange={(e) => setLessonName(e.target.value)} />
            </label>

            <label>
              Link Content:
              <input type="text" value={linkContent} onChange={(e) => setLinkContent(e.target.value)} />
            </label>

            <label>
              Description:
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </label>
            <div>
              <Button
                type="submit"
                onClick={handleSubmit}
                style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
              >
                Add Lesson
              </Button>
              <Button
                type="button"
                onClick={handleBackClick}
                style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
              >
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLesson;