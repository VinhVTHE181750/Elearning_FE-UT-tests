import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
function EditQuestion() {
  const { questionID } = useParams();
  const [questionName, setQuestionName] = useState('');
  const [quizID, setQuizID] = useState('');

  const [questionType, setQuestionType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [user, setUser] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);

  useEffect(() => {
    authApi
      .getQuestionById(questionID)
      .then((response) => {
        if (response.data && response.code === 0) {
          const { questionName, questionType, answerList, quizID } = response.data;
          setQuestionName(questionName);
          setQuestionType(questionType);
          setAnswers(answerList);
          setQuizID(quizID);
        } else {
          setErrorMessage('Failed to fetch question data!');
        }
      })
      .catch((error) => {
        setErrorMessage('Failed to fetch question data!');
        console.log(error);
      });
  }, [questionID]);

  const handleBack = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    navigate(`/view-quiz/${quizID}`);
  };
  const handleEditQuestion = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const params = {
      username: user,
      questionID,
      quizID: quizID,
      questionName,
      questionType,
      answers: answers,
    };

    authApi
      .updateQuestion(params)
      .then((response) => {
        if (response.data && response.code === 0) {
          setSuccessMessage('Edit Successfully!');
          setEditStatus('success');
        } else {
          setErrorMessage('Edit Failed!');
          setEditStatus('failed');
        }
      })
      .catch((error) => {
        setErrorMessage('Function Edit Failed!');
        console.log(error);
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          <ToastContainer position="top-end" className="p-3">
            {successMessage && (
              <Toast
                className="d-inline-block m-1"
                bg={editStatus === 'success' ? 'success' : 'danger'}
                autohide
                onClose={() => setSuccessMessage('')}
              >
                <Toast.Body className={editStatus === 'success' ? 'text-white' : ''}>{successMessage}</Toast.Body>
              </Toast>
            )}
            {errorMessage && (
              <Toast className="d-inline-block m-1" bg="danger" autohide onClose={() => setErrorMessage('')}>
                <Toast.Body className="text-white">{errorMessage}</Toast.Body>
              </Toast>
            )}
          </ToastContainer>

          <h1>Edit Question</h1>
          <div>
            <label>
              Question Name:
              <input type="text" value={questionName} onChange={(e) => setQuestionName(e.target.value)} />
            </label>

            <label>
              Question Type:
              <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                <option value="">Select Question Type</option>
                <option value="ONE_CHOICE">One Choice</option>
              </select>
            </label>

            {questionType === 'ONE_CHOICE' && (
              <>
                {answers?.map((data) => {
                  return (
                    <>
                      <input
                        type="text"
                        value={data.answerContent}
                        onChange={(e) => {
                          const newAnswers = answers?.map((a) => {
                            if (a?.id === data?.id) {
                              return {
                                ...data,
                                answerContent: e.target.value,
                              };
                            }
                            return a;
                          });
                          setAnswers(newAnswers);
                        }}
                      />
                    </>
                  );
                })}
                <div style={{ display: 'flex' }}>
                  {answers?.map((data, index) => {
                    return (
                      <>
                        <div style={{ display: 'flex' }}>
                          <input
                            type="radio"
                            name="result"
                            id={index}
                            value={data.id}
                            checked={data.correct}
                            onChange={(e) => {
                              const newAnswers = answers?.map((a) => {
                                if (a?.id === data?.id) {
                                  return {
                                    ...data,
                                    correct: true,
                                  };
                                }
                                return {
                                  ...a,
                                  correct: false,
                                };
                              });
                              setAnswers(newAnswers);
                            }}
                          />
                          <label htmlFor={index}>Option {index}</label>
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            )}

            <div className="button-container">
              <Button variant="primary" onClick={handleEditQuestion}>
                Edit
              </Button>
              <Button variant="primary" onClick={handleBack}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditQuestion;
