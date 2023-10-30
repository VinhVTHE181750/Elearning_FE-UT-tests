import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './add.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
const AddAnswer = () => {
  const [answerContent, setAnswerContent] = useState('');
  const [correct, setCorrect] = useState(true);

  const handleSaveAnswer = () => {
    const params = {
      questionID: 0,
      answerName: answerContent,
      correct: correct,
    };

    authApi
      .addAnswer(params)
      .then((response) => {
        // Xử lý logic sau khi thêm câu trả lời thành công
        console.log('Answer added successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error adding answer:', error);
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-answer-container">
          <h1>Add Answer</h1>
          <label>
            Answer Content:
            <input type="text" value={answerContent} onChange={(e) => setAnswerContent(e.target.value)} />
          </label>
          <br />
          <label>
            Correct:
            <select value={correct} onChange={(e) => setCorrect(e.target.value === 'true')}>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
          <br />
          <button onClick={handleSaveAnswer}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddAnswer;
