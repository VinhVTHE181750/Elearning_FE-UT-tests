import { Button, Card, List, Radio, Space, Table } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import authApi from '../../../api/authApi';
import { useState } from 'react';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import './index.css';

export default function ViewSubmitedQuiz({ quizId }) {
  const [quiz, setQuiz] = useState([]);
  const [type, setType] = useState('View list submitted');
  const [listSession, setListSession] = useState([]);
  const [listQuestion, setListQuestion] = useState([]);
  const [listAnswer, setListAnswer] = useState([]);
  const [listCorrectAnswer, setListCorrectAnswer] = useState([]);
  const [listInCorrectAnswer, setListInCorrectAnswer] = useState([]);
  const [questionId, setQuestionId] = useState('');
  const [correct, setCorrect] = useState('');

  useEffect(() => {
    authApi
      .getQuizById(quizId)
      .then((resp) => {
        setQuiz(resp.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    authApi
      .getQuestionByQuizId(quizId)
      .then((resp) => {
        setListQuestion(resp.data.questionList);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (localStorage.getItem('user-access-token')) {
      authApi
        .getSessionByQuizId({ username: jwtDecode(localStorage.getItem('user-access-token')).sub, quizId })
        .then((resp) => {
          const sortedListQuiz = resp.data.listQuiz.sort(
            (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
          );
          sortedListQuiz.forEach((item, index) => {
            item.index = index + 1;
          });
          setListSession(sortedListQuiz);
        })
        .catch((err) => {});
    }
  }, []);

  useEffect(() => {
    if (questionId !== 'video') {
      authApi
        .getAnswerByQuestionId(questionId)
        .then((response) => {
          setListAnswer(response.data);
        })
        .catch((err) => {});
    }
  }, [questionId]);

  useEffect(() => {
    if (type !== 'View list submitted') {
    }
  }, [type]);

  const handleViewClick = (sessionId, no) => {
    setType(`Submitted of quiz number ${no}`);
    authApi
      .getCorrectAnswerBySession(sessionId)
      .then((resp) => {
        setListCorrectAnswer(resp.data.answerListCorrect);
        setListInCorrectAnswer(resp.data.answerListIncorrect);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Submitted Date',
      render: (record) => {
        const formatDate = moment(record.createdAt).format('MMMM Do YYYY, h:mm a');
        return <a>{formatDate}</a>;
      },
    },
    {
      title: 'Score',
      render: (record) => {
        return <a>{((record.totalCorrect / record.totalIncorrect) * 100).toFixed(2)}%</a>;
      },
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button style={{ width: '80px' }} onClick={() => handleViewClick(record.sessionId, record.index)}>
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
      <Card
        title={
          <span style={{ cursor: 'pointer' }} onClick={() => setType('View list submitted')}>
            List submitted of quiz: {quiz.name}
          </span>
        }
        style={{ margin: 0 }}
        bodyStyle={{ padding: '0 24' }}
      >
        {type === 'View list submitted' ? (
          <Table columns={columns} dataSource={listSession} rowKey={(record) => record.id} />
        ) : (
          <div>
            <a style={{ fontSize: '20px', fontWeight: 'bold' }}>{type}</a>
            <List
              pagination={{ pageSize: 1, align: 'center' }}
              dataSource={listQuestion}
              rowKey={(data) => data.id}
              renderItem={(data) => {
                setQuestionId(data.id);
                const answerUserChoice = listCorrectAnswer.find((answer) => answer.questionId === data.id);
                const answerUserChoiceIncorrect = listInCorrectAnswer.find((answer) => answer.questionId === data.id);
                if (answerUserChoice) setCorrect(true);
                else setCorrect(false);
                return (
                  <List.Item key={data.id} style={{ display: 'contents' }}>
                    <Card type="inner" title={`Question ${data.ordQuestion}:${data.questionName}`}>
                      <Radio.Group
                        value={
                          answerUserChoice !== undefined
                            ? answerUserChoice.id
                            : answerUserChoiceIncorrect !== undefined && answerUserChoiceIncorrect.id
                        }
                      >
                        <Space direction="vertical">
                          {listAnswer.map((answer) => (
                            <Radio value={answer.answerId}>{answer.answerContent}</Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                      <p style={correct ? { color: 'green' } : { color: 'red' }}>
                        {correct ? 'The answer is correct' : 'The answer is not correct'}
                      </p>
                    </Card>
                  </List.Item>
                );
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
