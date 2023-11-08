import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { Table, Button } from 'antd';
import TakeQuiz from './TakeQuiz/TakeQuiz';
import ReactPlayer from 'react-player';
import ViewSubmitedQuiz from './ViewSubmitedQuiz/ViewSubmitedQuiz';
import jwtDecode from 'jwt-decode';

export default function Lesson() {
  const [listLesson, setListLesson] = useState([]);
  const [listQuiz, setListQuiz] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [courseName, setCourseName] = useState('');
  const [quizId, setQuizId] = useState('');
  const [typeQuiz, setTypeQuiz] = useState('Video');
  const [url, setUrl] = useState('');
  const [session, setSession] = useState('');
  const { id } = useParams();
  const [doneLesson, setDoneLesson] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    authApi
      .getLessonById(id)
      .then((response) => {
        setUrl(response.data.linkContent);
        setCourseID(response.data.course.id);
        setCourseName(response.data.course.name);
      })
      .catch((err) => {
        console.log(err);
      });
    authApi.findAllQuiz().then((response) => {
      setListQuiz(response.data.quizList);
    });
  }, [id]);

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    if (courseID) {
      authApi
        .getLessonByCourseId(courseID)
        .then((response) => {
          setListLesson(response.data.lessonList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [courseID]);

  const handleDone = (lessonId) => {};

  const handleQuiz = (type, quizId) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    authApi
      .startQuiz(quizId)
      .then((response) => {
        setSession(response.data.sessionId);
      })
      .catch((err) => {});
    setTypeQuiz(type);
    setQuizId(quizId);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'ordNumber',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
    },
  ];

  const handleVideoEnd = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    const quiz = listQuiz.find((quiz) => quiz.lesson.id === id);
    if (!quiz) {
      window.alert('Video finish');
      authApi
        .completeLesson({ username: jwtDecode(localStorage.getItem('user-access-token')).sub, lessonId: id })
        .then((resp) => {})
        .catch((err) => {});
    }
  };

  return (
    <>
      <Header />
      <div style={{ backgroundColor: 'RGBA(0,0,87,0.23)', paddingBottom: '150px' }}>
        <h3 style={{ textAlign: 'center' }}>{courseName}</h3>
        <div className="row" style={{ marginBottom: '20px', marginTop: '30px' }}>
          <div>
            {typeQuiz === 'Video' ? (
              <div
                style={{
                  marginTop: '20px',
                  marginLeft: '20px',
                }}
              >
                <ReactPlayer url={url} controls width="960px" height="480px" onEnded={() => handleVideoEnd()} />
              </div>
            ) : typeQuiz === 'Start' ? (
              <TakeQuiz quizId={quizId} courseID={courseID} session={session} lessonId={id} />
            ) : (
              <ViewSubmitedQuiz quizId={quizId} />
            )}
          </div>
          <div style={{ position: 'absolute', right: '0' }}>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              pagination={{ position: ['bottomCenter'], pageSize: 5 }}
              style={{ maxWidth: '500px', cursor: 'pointer' }}
              onRow={(record) => ({ onClick: () => (window.location.href = `/viewLesson/${record.id}`) })}
              expandable={{
                expandedRowRender: (record) => {
                  const quiz = listQuiz.find((quiz) => quiz.lesson.id === record.id);
                  return (
                    <div style={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                      <p style={{ textAlign: 'left', color: '#000' }}>
                        Quiz: {quiz.name}
                        <br />
                        <Button
                          style={{ width: '120px', marginLeft: '10px' }}
                          onClick={() => handleQuiz('Start', quiz.id)}
                        >
                          Start quiz
                        </Button>
                        <Button style={{ marginLeft: '10px' }} onClick={() => handleQuiz('View', quiz.id)}>
                          View submitted quiz history
                        </Button>
                      </p>
                    </div>
                  );
                },
                rowExpandable: (record) => listQuiz.find((quiz) => quiz.lesson.id === record.id),
              }}
              dataSource={listLesson}
            />
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
}
