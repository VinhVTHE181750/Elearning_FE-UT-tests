import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';

const ViewQuiz = () => {
  const { quizID } = useParams();
  const [quizToView, setQuizToView] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .findAllQuiz()
      .then((response) => {
        const quizArray = (response.data && response.data.quizList) || [];
        console.log('Data của quizArray:', quizArray);

        // Lưu dữ liệu vào state
        setQuizToView(quizArray);
      })
      .catch((error) => {
        console.error('Error fetching quiz data:', error);
      });

    authApi
      .findAllQuestion()
      .then((response) => {
        const questionArray = response.data || [];
        console.log('Data của questionArray:', questionArray);

        // Lưu dữ liệu vào state
        setQuestions(questionArray);
      })
      .catch((error) => {
        console.error('Error fetching question data:', error);
      });
  }, []);

  useEffect(() => {
    console.log('Data của quizToView:', quizToView);
  }, [quizToView]);

  useEffect(() => {
    console.log('Data của questions:', questions);
  }, [questions]);

  const handleAddQuestion = (id) => {
    navigate(`/add-question/${id}`);
  };

  const handleViewAnswer = (questionID) => {
    navigate(`/view-answer/${questionID}`);
  };

  const handleEditQuestion = (id) => {
    navigate(`/edit-question/${id}`);
  };

  const handleDeleteQuestion = (questionID) => {
    const questionToDelete = questions.find((question) => question.quizID === parseInt(quizID));
    if (questionToDelete) {
      if (window.confirm('Do you want to delete this question?')) {
        const params = {
          quizID,
          questionID,
        };
        authApi
          .deleteQuestion(params)
          .then((response) => {
            if (response.data && response.code === 0) {
              setSuccessMessage('Delete Successfully!');
              // Remove the deleted question from the questions state
              setQuestions(questions.filter((question) => question.id !== questionID));
            } else {
              setErrorMessage('Delete Failed!');
            }
          })
          .catch((error) => {
            setErrorMessage('Function Delete Failed!');
            console.log('');
          });
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {quizToView ? (
            <div>
              <h1>Quiz Detail</h1>
              {quizToView.length > 0 ? (
                <ul>
                  {quizToView.map((quiz) => {
                    if (quiz.id === parseInt(quizID)) {
                      return <li key={quiz.id}>Name: {quiz.name}</li>;
                    }
                  })}
                </ul>
              ) : (
                <div>No quizzes available</div>
              )}
            </div>
          ) : (
            <div>Loading quiz details...</div>
          )}

          <h2>List Question</h2>
          {questions.length > 0 ? (
            <ul>
              {questions.map((question) => {
                if (question.quizID === parseInt(quizID)) {
                  return (
                    <li key={question.id}>
                      {question.questionName} {question.questionType}
                      <button onClick={() => handleEditQuestion(question.id)}>Edit</button>
                      <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
                      <button onClick={() => handleViewAnswer(question.id)}>View</button>
                    </li>
                  );
                }
              })}
            </ul>
          ) : (
            <div>No questions available</div>
          )}

          <button onClick={() => handleAddQuestion(quizID)}>Add Question</button>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;
