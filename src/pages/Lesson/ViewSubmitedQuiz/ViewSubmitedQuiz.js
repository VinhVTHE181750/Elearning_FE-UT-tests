import { Button, Card, Space, Table } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import authApi from '../../../api/authApi';
import { useState } from 'react';

export default function ViewSubmitedQuiz({ quizId, lessonId }) {
  const [quiz, setQuiz] = useState([]);
  const [type, setType] = useState([]);

  useEffect(() => {
    authApi
      .getQuizById(quizId)
      .then((resp) => {
        setQuiz(resp.data);

        //     const data = questions
        // .filter((question) => question.quizID === parseInt(quizID))
        // .map((question, index) => ({
        //   key: index,
        //   index: index + 1,
        //   questionName: question.questionName,
        //   id: question.id,
        // }));
      })
      .catch((err) => {});
  }, []);

  const handleViewClick = (sessionId) => {};

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'abc',
    },
    {
      title: 'Score',
      dataIndex: 'def',
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button style={{ width: '80px' }} onClick={() => handleViewClick(record.id)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#FAFAFA',
        width: '960px',
        height: '480px',
        marginTop: '20px',
        marginLeft: '30px',
        borderRadius: '10px',
      }}
    >
      <Card title={'List submitted of quiz: ' + quiz.name} style={{ margin: 0 }}>
        <Table columns={columns} dataSource={''} rowKey={(record) => record.id} />
      </Card>
    </div>
  );
}
