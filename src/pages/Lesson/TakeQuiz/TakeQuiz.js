import { useEffect, useState } from 'react';
import { List, Table, Button, Card, Radio, Space } from 'antd';
import authApi from '../../../api/authApi';

export default function TakeQuiz({ quizId, type }) {
  const [questionId, setQuestionId] = useState(-1);
  const [listQuestion, setListQuestion] = useState([]);
  const [listAnswer, setListAnswer] = useState([]);
  const [listUserChooseAnswer, setListUserChooseAnswer] = useState([]);
  const [valueRadio, setValueRadio] = useState('-1');

  useEffect(() => {
    authApi.getQuestionByQuizId(13).then((response) => {
      setListQuestion(response.data.questionList);
    });
  }, [quizId]);

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
    // const params = {
    //   username: jwtDecode(localStorage.getItem('user-access-token')).sub,
    //   courseId: courseID,
    //   quizId: typeShow,
    // };
  };

  const onChangeAnswerUserChoose = (questionId, answer) => {
    setValueRadio(answer);
    const currentListUserChooseAnswer = listUserChooseAnswer;
    const answerToUpdate = currentListUserChooseAnswer.find((answer) => answer.questionId === questionId);
    if (answerToUpdate) {
      answerToUpdate.answer = answer;
    } else {
      currentListUserChooseAnswer.push({
        questionId,
        answer,
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
          console.log(answerUserChoose);
          return (
            <List.Item key={data.id} style={{ display: 'contents' }}>
              <Card type="inner" title={`Question ${data.ordQuestion}:${data.questionName}`}>
                <Radio.Group
                  onChange={(e) => onChangeAnswerUserChoose(data.id, e.target.value)}
                  value={answerUserChoose !== undefined ? answerUserChoose.answer : valueRadio}
                >
                  <Space direction="vertical">
                    {listAnswer.map((answer) => (
                      <Radio value={answer.answerContent}>{answer.answerContent}</Radio>
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
