import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './ViewAnswer.css';
import { Table, Button, Space } from 'antd';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';

const ViewAnswer = () => {
  const { questionID } = useParams();
  const [answers, setAnswers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [user, setUser] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);
  console.log('user: ', user);
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
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate('/edit-answer');
  };

  const handleDeleteAnswer = (answerID) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    if (window.confirm('Do you want to delete this answer?')) {
      const params = {
        username: user,
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
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate('/add-answer');
  };
  const columns = [
    {
      title: 'AnswerContent',
      dataIndex: 'answerContent',
      key: 'answerContent',
    },
    {
      title: 'Correct',
      dataIndex: 'correct',
      key: 'correct',
      render: (record) => (record.correct ? 'true' : 'false'),
    },
    {
      title: 'CreatedBy',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'UpdatedBy',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button style={{ width: '80px' }} onClick={() => handleEditAnswer(record.id)}>
            Edit
          </Button>
          <Button style={{ width: '80px' }} onClick={() => handleDeleteAnswer(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <h1>View Answer</h1>
          <Table columns={columns} dataSource={answers} />
        </div>
      </div>
    </div>
  );
};

export default ViewAnswer;
