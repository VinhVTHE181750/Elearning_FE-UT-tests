import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';

const Answer = () => {
  const { questionID, answerID } = useParams();
  const [answerContent, setAnswerContent] = useState('');
  const [correct, setCorrect] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEditAnswer = () => {
    const params = {
      questionID,
      answerID,
      answerContent,
      correct,
    };
    authApi
      .updateAnswer(params)
      .then((response) => {
        if (response.data && response.code === 0) {
          setSuccessMessage('Update Successfully!');
        } else {
          setErrorMessage('Update Failed!');
        }
      })
      .catch((error) => {
        setErrorMessage('Function Update Failed!');
        console.log('');
      });
  };

  return (
    <div>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <h1>Edit Answer</h1>
      <div>
        <label>Answer Content:</label>
        <input type="text" value={answerContent} onChange={(e) => setAnswerContent(e.target.value)} />
      </div>
      <div>
        <label>Correct:</label>
        <select value={correct} onChange={(e) => setCorrect(e.target.value === 'true')}>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <button onClick={handleEditAnswer}>Save</button>
    </div>
  );
};

export default Answer;