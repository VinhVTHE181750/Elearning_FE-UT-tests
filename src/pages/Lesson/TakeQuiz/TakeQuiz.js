import { useEffect, useState } from 'react';
import { List, Table, Button, Card, Radio, Space, Alert } from 'antd';
import authApi from '../../../api/authApi';
import jwtDecode from 'jwt-decode';

export default function TakeQuiz({ quizId, type, courseID, session }) {
  const [questionId, setQuestionId] = useState(-1);
  const [listQuestion, setListQuestion] = useState([]);
  const [listAnswer, setListAnswer] = useState([]);
  const [listUserChooseAnswer, setListUserChooseAnswer] = useState([]);
  const [valueRadio, setValueRadio] = useState('-1');

  useEffect(() => {
    authApi.getQuestionByQuizId(13).then((response) => {
      setListQuestion(response.data.questionList);
    });
  }, [session]);

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

  const handleSubmit = () => {
    if (listUserChooseAnswer.length !== listQuestion.length) {
      return window.alert('The question is not choose answer!');
    }
    const params = {
      username: jwtDecode(localStorage.getItem('user-access-token')).sub,
      courseId: courseID,
      quizId: quizId,
      sessionId: session,
      answerIdList: listUserChooseAnswer.map((answer) => answer.answerId),
    };
    authApi
      .finishQuiz(params)
      .then((response) => {
        return window.alert(`Total correct: ${response.data.totalCorrect} and mark: ${response.data.percent}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeAnswerUserChoose = (questionId, answerId) => {
    setValueRadio(answerId);
    const currentListUserChooseAnswer = listUserChooseAnswer;
    const answerToUpdate = currentListUserChooseAnswer.find((answer) => answer.questionId === questionId);
    if (answerToUpdate) {
      answerToUpdate.answerId = answerId;
    } else {
      currentListUserChooseAnswer.push({
        questionId,
        answerId,
      });
    }
    setListUserChooseAnswer(currentListUserChooseAnswer);
  };

  return (
    <div
      className="take-quiz-list-question"
      style={{
        backgroundColor: '#FAFAFA',
        width: '800px',
        height: '480px',
        marginTop: '20px',
        marginLeft: '30px',
        borderRadius: '10px',
      }}
    >
      {/* <a style={{ textAlign: 'center', fontWeight: 'bold' }}>Quiz: {nameQuiz}</a> */}
      <List
        pagination={{ pageSize: 1, align: 'center' }}
        dataSource={listQuestion}
        rowKey={(data) => data.id}
        renderItem={(data) => {
          setQuestionId(data.id);
          const answerUserChoose = listUserChooseAnswer.find((answer) => answer.questionId === data.id);
          return (
            <List.Item key={data.id} style={{ display: 'contents' }}>
              <Card type="inner" title={`Question ${data.ordQuestion}:${data.questionName}`}>
                <Radio.Group
                  onChange={(e) => onChangeAnswerUserChoose(data.id, e.target.value)}
                  value={answerUserChoose !== undefined ? answerUserChoose.answerId : valueRadio}
                >
                  <Space direction="vertical">
                    {listAnswer.map((answer) => (
                      <Radio value={answer.answerId}>{answer.answerContent}</Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Card>
              <Button style={{ marginLeft: '40%' }} onClick={handleSubmit}>
                Submit
              </Button>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
