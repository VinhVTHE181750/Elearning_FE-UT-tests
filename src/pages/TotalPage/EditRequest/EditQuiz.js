import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';

const EditQuiz = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [lesson, setLesson] = useState('');
  const [editedQuiz, setEditedQuiz] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);

  useEffect(() => {
    console.log(quizID);
    if (quizID) {
      authApi.getQuizById(quizID).then((res) => {
        console.log(res);
        if (res.code === 0) {
          setLesson(res.data.lesson);
        }
      });
    }
  }, [quizID]);
  const nameRegex = /^[a-zA-Z0-9]+[A-Za-zÀ-ỹ0-9!@#$%^&*(),.?":{}|<>':\s]+$/;

  const handleSaveClick = () => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    if (!nameRegex.test(editedQuiz.trim())) return window.alert('Error: Quiz Name invalidate!');

    const params = {
      username: user,
      quizID: quizID,
      quizName: editedQuiz,
      lessonID: lesson.id,
      lessonName: lesson.name,
    };

    // Call API to update quiz
    authApi
      .updateQuiz(params)
      .then((response) => {
        // Handle success
        setSuccessMessage('Quiz updated successfully.');
      })
      .catch((error) => {
        // Handle error
        setErrorMessage('Failed to update quiz.');
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          <h2>Edit Quiz</h2>
          <div className="form-group">
            <label className="label">Quiz Name:</label>
            <input
              type="text"
              value={editedQuiz.quizName}
              onChange={(e) => setEditedQuiz(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" onClick={handleSaveClick} className="button">
            Save
          </button>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
