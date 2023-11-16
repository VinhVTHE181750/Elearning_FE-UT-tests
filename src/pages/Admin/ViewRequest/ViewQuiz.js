import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Table, Button, message } from 'antd';

const ViewQuiz = () => {
  const { quizID } = useParams();
  const [quizToView, setQuizToView] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [quizName, setQuizName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);

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

  useEffect(() => {
    setQuizName(quizToView.find((quiz) => quiz.id === parseInt(quizID))?.name || '');
  }, [quizToView, quizID]);

  const handleAddQuestion = (id) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/add-question/${id}`);
  };

  const handleViewAnswer = (questionID) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/view-answer/${questionID}`);
  };

  const handleEditQuestion = (id) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/edit-question/${id}`);
  };

  const handleDeleteQuestion = (questionID) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const questionToDelete = questions.find((question) => question.quizID === parseInt(quizID));
    if (questionToDelete) {
      if (window.confirm('Do you want to delete this question?')) {
        const params = {
          username: user,
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

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Question Name',
      dataIndex: 'questionName',
      key: 'questionName',
    },

    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <div>
          <Button
            type="primary"
            style={{ width: '100px', backgroundColor: 'green' }}
            size="small"
            onClick={() => handleEditQuestion(record.id)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            style={{ width: '100px' }}
            danger
            size="small"
            onClick={() => handleDeleteQuestion(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = questions
    .filter((question) => question.quizID === parseInt(quizID))
    .filter((question) => question.questionName.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((question, index) => ({
      key: index,
      index: index + 1,
      questionName: question.questionName,
      id: question.id,
    }));

  const pagination = {
    pageSize: 10, // Number of items displayed per page
    hideOnSinglePage: true, // Hide pagination if there is only one page
    showSizeChanger: false, // Hide page size changer
  };

  return (
    <div style={{ display: 'flex', color: '#fff' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div>
          <h1 style={{ color: 'yellowgreen' }}>Quiz Detail</h1>
          {quizName ? (
            <Table
              columns={[
                {
                  title: 'QuizID',
                  dataIndex: 'quizID',
                  key: 'quizID',
                },
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                },
              ]}
              dataSource={[
                {
                  key: quizID,
                  quizID: quizID,
                  name: quizName,
                },
              ]}
            />
          ) : (
            <div>Loading quiz details...</div>
          )}
          <h2 style={{ color: 'yellowgreen' }}>List Question</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search question by name"
          />
          {filteredData.length > 0 ? (
            <Table columns={columns} dataSource={filteredData} />
          ) : (
            <div>No questions available</div>
          )}
          <Button type="primary" onClick={() => handleAddQuestion(quizID)}>
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewQuiz;
