import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './add.css';
import authApi from '../../../api/authApi';
import jwt_decode from 'jwt-decode';
import { useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';

function AddQuiz() {
  const { lessonID } = useParams();
  const [courseID, setCourseID] = useState('');
  const [quizName, setQuizName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [checkFinalQuiz, setCheckFinalQuiz] = useState(false);

  const [user, setUser] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
      authApi
        .getLessonById(lessonID)
        .then((resp) => {
          setCourseID(resp.data.course.id);
        })
        .catch((err) => {});
    }
  }, []);

  useEffect(() => {
    if (courseID) {
      authApi
        .checkFinalQuiz({ courseId: courseID })
        .then((resp) => {
          setCheckFinalQuiz(resp.data.finalQuiz);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [courseID]);

  const nameRegex = /^[a-zA-Z0-9]+[A-Za-zÀ-ỹ0-9!@#$%^&*(),.?":{}|<>':\s]+$/;

  const handleSubmit = (e) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    if (!nameRegex.test(quizName.trim())) return window.alert('Error: Quiz Name invalidate!');

    e.preventDefault();

    if (lessonID && quizName) {
      const params = {
        username: user,
        lessonID: lessonID,
        quizName,
        finalQuiz: isFinal, // Use the updated state variable
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

  console.log(checkFinalQuiz);
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-quiz-container">
          <h1>Add Quiz</h1>
          {message && <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>}
          <form>
            <div>
              <label>
                Quiz Name:
                <input type="text" value={quizName} onChange={(e) => setQuizName(e.target.value)} />
              </label>
            </div>
            {!checkFinalQuiz && (
              <div>
                <label>
                  Is Final Quiz: <input type="checkbox" checked={isFinal} onChange={() => setIsFinal(!isFinal)} />
                </label>
              </div>
            )}
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
