import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';

const EditQuiz = () => {
  const { quizID } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [lesson, setLesson] = useState('');
  const [editedQuiz, setEditedQuiz] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleSaveClick = () => {
    const params = {
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
  );
};

export default EditQuiz;
