import { useEffect, useState } from 'react';
import { List, Table, Button, Card, Radio, Space, Alert, Modal } from 'antd';
import authApi from '../../../api/authApi';
import jwtDecode from 'jwt-decode';

export default function TakeQuiz({ quizId, courseID, lessonId, session }) {
  const [questionId, setQuestionId] = useState(-1);
  const [listQuestion, setListQuestion] = useState([]);
  const [listAnswer, setListAnswer] = useState([]);
  const [listUserChooseAnswer, setListUserChooseAnswer] = useState([]);
  const [valueRadio, setValueRadio] = useState('-1');
  const [showModal, setShowModal] = useState(false);
  const [resultQuiz, setResultQuiz] = useState([]);

  console.log(quizId);
  useEffect(() => {
    authApi.getQuestionByQuizId(quizId).then((response) => {
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

  const showModalFunc = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
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
        setResultQuiz(response.data);
        showModalFunc();
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

  const handleClose = () => {
    setShowModal(false);
    window.location.href = `/viewLesson/${lessonId}`;
  };

  return (
    <div
      className="take-quiz-list-question"
      style={{
        backgroundColor: '#FAFAFA',
        width: '960px',
        height: '480px',
        marginTop: '20px',
        marginLeft: '30px',
        borderRadius: '10px',
      }}
    >
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
              <Modal
                title="Quiz Result"
                visible={showModal}
                onOk={() => handleClose()}
                onCancel={() => handleClose()}
                footer={[
                  <Button key="submit" type="primary" style={{ textAlign: 'center' }} onClick={() => handleClose()}>
                    OK
                  </Button>,
                ]}
              >
                <p>Total Correct: {resultQuiz.totalCorrect}</p>
                <p>Total Incorrect: {resultQuiz.totalInCorrect}</p>
                <p>Score: {resultQuiz.percent * 100}%</p>
              </Modal>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
