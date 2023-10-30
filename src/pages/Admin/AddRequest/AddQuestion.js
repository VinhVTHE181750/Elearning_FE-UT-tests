import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './add.css';
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';

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

  console.log('Quiz ID:', quizID);

  const handleSubmit = (e) => {
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
        quizID: quizID,
        questionName,
        questionType,
        listAnswer: answers,
      };
      console.log(select);

      authApi
        .addQuestion(params)
        .then((response) => {
          setMessage('Question Added Successfully');
          setIsSuccess(true);
        })
        .catch((error) => {
          setMessage('Failed to Add Question');
          setIsSuccess(false);
        });
    } else {
      setMessage('Failed to Add Question');
      setIsSuccess(false);
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
    const newSelect = [...select, value];
    setSelect(newSelect);
  };
  const removeSelect = (value) => {
    const newSelect = select?.filter((data) => data !== value);
    setSelect(newSelect);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-question-container">
          <h1>Add Question</h1>
          {message && <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>}
          <form onSubmit={handleSubmit}>
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
            ) : questionType === 'MUILTPLE_CHOICE' ? (
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
                      type="checkbox"
                      name="result"
                      id="A"
                      value={'A'}
                      onChange={(e) => {
                        console.log(e.target.checked);
                        const check = e.target.checked;
                        if (check) {
                          addSelect(e.target.value);
                        } else {
                          removeSelect(e.target.value);
                        }
                      }}
                    />
                    <label htmlFor="A">A</label>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <input
                      type="checkbox"
                      name="result"
                      id="B"
                      value={'B'}
                      onChange={(e) => {
                        console.log(e.target.checked);
                        const check = e.target.checked;
                        if (check) {
                          addSelect(e.target.value);
                        } else {
                          removeSelect(e.target.value);
                        }
                      }}
                    />
                    <label htmlFor="B">B</label>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <input
                      type="checkbox"
                      name="result"
                      id="C"
                      value={'C'}
                      onChange={(e) => {
                        console.log(e.target.checked);
                        const check = e.target.checked;
                        if (check) {
                          addSelect(e.target.value);
                        } else {
                          removeSelect(e.target.value);
                        }
                      }}
                    />
                    <label htmlFor="C">C</label>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <input
                      type="checkbox"
                      name="result"
                      id="D"
                      value={'D'}
                      onChange={(e) => {
                        console.log(e.target.checked);
                        const check = e.target.checked;
                        if (check) {
                          addSelect(e.target.value);
                        } else {
                          removeSelect(e.target.value);
                        }
                      }}
                    />
                    <label htmlFor="D">D</label>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            <button type="submit" onClick={handleSubmit}>
              Add Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;
