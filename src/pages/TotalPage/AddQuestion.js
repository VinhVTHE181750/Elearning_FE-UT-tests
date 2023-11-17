import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './add.css';
import authApi from '../../api/authApi';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Alert } from '@mui/material';
import { Button } from 'antd';
function AddQuestion() {
  const { quizID } = useParams();
  const [questionName, setQuestionName] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [choose, setChoose] = useState('');
  const [select, setSelect] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  console.log('Quiz ID:', quizID);

  const [user, setUser] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);
  const handleSubmit = (e) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    e.preventDefault();

    if (quizID && questionName && questionType) {
      let answers;
      if (questionType === 'ONE_CHOICE') {
        const answerA = {
          answerContent: optionA,
          correct: choose === 'A',
        };
        const answerB = {
          answerContent: optionB,
          correct: choose === 'B',
        };
        const answerC = {
          answerContent: optionC,
          correct: choose === 'C',
        };
        const answerD = {
          answerContent: optionD,
          correct: choose === 'D',
        };
        answers = [answerA, answerB, answerC, answerD];
      } else {
        const answerA = {
          answerContent: optionA,
          correct: select.includes('A'),
        };
        const answerB = {
          answerContent: optionB,
          correct: select.includes('B'),
        };
        const answerC = {
          answerContent: optionC,
          correct: select.includes('C'),
        };
        const answerD = {
          answerContent: optionD,
          correct: select.includes('D'),
        };
        answers = [answerA, answerB, answerC, answerD];
      }
      const params = {
        username: user,
        quizID: quizID,
        questionName,
        questionType,
        listAnswer: answers,
      };
      console.log(select);

      authApi
        .addQuestion(params)
        .then((response) => {
          setShowSuccessAlert(true);
          setShowErrorAlert(false);
        })
        .catch((error) => {
          setShowSuccessAlert(false);
          setShowErrorAlert(true);
        });
    } else {
      setShowSuccessAlert(false);
      setShowErrorAlert(true);
    }

    setQuestionName('');
    setQuestionType('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setChoose('');
    setSelect([]);
  };
  const addSelect = (value) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const newSelect = [...select, value];
    setSelect(newSelect);
  };
  const removeSelect = (value) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const newSelect = select?.filter((data) => data !== value);
    setSelect(newSelect);
  };
  const navigate = useNavigate();

  const handleBack = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/view-quiz/${quizID}`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-question-container">
          <h1>Add Question</h1>
          {showSuccessAlert && (
            <Alert severity="success" sx={{ backgroundColor: 'lightblue', color: 'green' }}>
              Add Question Successful!
            </Alert>
          )}
          {showErrorAlert && (
            <Alert severity="error" sx={{ backgroundColor: 'lightcoral' }}>
              Fail to Add Question!
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <label>
              Question Name:
              <input type="text" value={questionName} onChange={(e) => setQuestionName(e.target.value)} />
            </label>
            <>
              <input
                type="text"
                placeholder="Answer A"
                name="a"
                onChange={(e) => setOptionA(e.target.value)}
                value={optionA}
              />
              <input
                type="text"
                placeholder="Answer B"
                name="b"
                onChange={(e) => setOptionB(e.target.value)}
                value={optionB}
              />
              <input
                type="text"
                placeholder="Answer C"
                name="c"
                onChange={(e) => setOptionC(e.target.value)}
                value={optionC}
              />
              <input
                type="text"
                placeholder="Answer D"
                name="d"
                onChange={(e) => setOptionD(e.target.value)}
                value={optionD}
              />
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex' }}>
                  <input
                    type="radio"
                    name="result"
                    id="A"
                    value={'A'}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setChoose(e.target.value);
                    }}
                  />
                  <label htmlFor="A">A</label>
                </div>
                <div style={{ display: 'flex' }}>
                  <input
                    type="radio"
                    name="result"
                    id="B"
                    value={'B'}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setChoose(e.target.value);
                    }}
                  />
                  <label htmlFor="B">B</label>
                </div>
                <div style={{ display: 'flex' }}>
                  <input
                    type="radio"
                    name="result"
                    id="C"
                    value={'C'}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setChoose(e.target.value);
                    }}
                  />
                  <label htmlFor="C">C</label>
                </div>
                <div style={{ display: 'flex' }}>
                  <input
                    type="radio"
                    name="result"
                    id="D"
                    value={'D'}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setChoose(e.target.value);
                    }}
                  />
                  <label htmlFor="D">D</label>
                </div>
              </div>
            </>

            <div>
              <Button
                type="submit"
                onClick={handleSubmit}
                style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
              >
                Add Question
              </Button>
              <Button
                type="button"
                onClick={handleBack}
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

export default AddQuestion;
