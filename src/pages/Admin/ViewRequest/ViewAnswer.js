import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './ViewAnswer.css';
import Sidebar from '../../../components/Sidebar/Sidebar';

const ViewAnswer = () => {
  const { questionID } = useParams();
  const [answers, setAnswers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    authApi
      .findAllAnswer()
      .then((response) => {
        const answerArray = response.data || [];
        console.log('Data của answerArray:', answerArray);

        // Lưu dữ liệu vào state
        setAnswers(answerArray);
      })
      .catch((error) => {
        console.error('Error fetching answer data:', error);
        setErrorMessage('Error fetching answer data');
      });
  }, []);

  useEffect(() => {
    console.log('Data của answers:', answers);
  }, [answers]);

  const handleEditAnswer = (answerID) => {
    navigate('/edit-answer');
  };

  const handleDeleteAnswer = (answerID) => {
    if (window.confirm('Do you want to delete this answer?')) {
      const params = {
        questionID,
        answerID,
      };
      authApi
        .deleteAnswer(params)
        .then((response) => {
          if (response.data && response.code === 0) {
            setSuccessMessage('Delete Successfully!');
            // Xóa câu trả lời đã bị xóa khỏi danh sách câu trả lời
            setAnswers(answers.filter((answer) => answer.id !== answerID));
          } else {
            setErrorMessage('Delete Failed!');
          }
        })
        .catch((error) => {
          setErrorMessage('Function Delete Failed!');
          console.log('');
        });
    }
  };

  const handleAddAnswer = () => {
    navigate('/add-answer');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <h1>View Answer</h1>
          <table>
            <thead>
              <tr>
                <th>Answer Content</th>
                <th>Correct</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((answer) => (
                <tr key={answer.answerID}>
                  <td>{answer.answerContent}</td>
                  <td>{answer.correct ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => handleEditAnswer(answer.answerID)}>Edit</button>
                    <button onClick={() => handleDeleteAnswer(answer.answerID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAnswer;
