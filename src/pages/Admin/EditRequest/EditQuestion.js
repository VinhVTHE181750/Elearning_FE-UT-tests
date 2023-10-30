import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
const EditQuestion = () => {
  const { questionID } = useParams();
  const [questionName, setQuestionName] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [quizID, setQuizID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

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
  const handleEditQuestion = () => {
    const params = {
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
        } else {
          setErrorMessage('Edit Failed!');
        }
      })
      .catch((error) => {
        setErrorMessage('Function Edit Failed!');
        console.log('');
      });
  };

  return (
    <div className="container-edit">
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <h1>Edit Question</h1>
      <div>
        <label>
          Question Name:
          <input type="text" value={questionName} onChange={(e) => setQuestionName(e.target.value)} />
        </label>

        <label>
          Question Type:
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="ONE_CHOICE">One Choice</option>
            <option value="MUILTPLE_CHOICE">MUILTPLE_CHOICE</option>
          </select>
        </label>
        {questionType === 'ONE_CHOICE' ? (
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
        ) : questionType === 'MUILTPLE_CHOICE' ? (
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
                        type="checkbox"
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
                            return a;
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
        ) : (
          <></>
        )}

        <button onClick={handleEditQuestion}>Edit</button>
      </div>
    </div>
  );
};

export default EditQuestion;
