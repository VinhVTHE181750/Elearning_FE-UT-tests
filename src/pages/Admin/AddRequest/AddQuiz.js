import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './add.css';
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';

function AddQuiz() {
  const { lessonID } = useParams();
  const [quizName, setQuizName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  console.log('Lesson ID:', lessonID);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (lessonID && quizName) {
      const params = {
        lessonID: lessonID,
        quizName,
      };

      authApi
        .addQuiz(params)
        .then((response) => {
          setMessage('Quiz Added Successfully');
          setIsSuccess(true);
        })
        .catch((error) => {
          setMessage('Failed to Add Quiz');
          setIsSuccess(false);
        });
    } else {
      setMessage('Failed to Add Quiz');
      setIsSuccess(false);
    }

    setQuizName('');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-quiz-container">
          <h1>Add Quiz</h1>
          {message && <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Quiz Name:
              <input type="text" value={quizName} onChange={(e) => setQuizName(e.target.value)} />
            </label>

            <button type="submit" onClick={handleSubmit}>
              Add Quiz
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddQuiz;
