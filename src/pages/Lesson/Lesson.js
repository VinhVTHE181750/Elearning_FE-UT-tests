import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../api/authApi';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import Comment from './Comment/Comment';
import Iframe from 'react-iframe';
import { Table, Button } from 'antd';
import TakeQuiz from './TakeQuiz/TakeQuiz';
import Post from './Comments/Post'

export default function Lesson() {
  const [listLesson, setListLesson] = useState([]);
  const [listQuiz, setListQuiz] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [courseName, setCourseName] = useState('');
  const [quizId, setQuizId] = useState('video');
  const [typeQuiz, setTypeQuiz] = useState('');
  const [url, setUrl] = useState('');
  const [session, setSession] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
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
    // if ( type === 'View' ) {
    //   authApi.startQuiz
    // }
    authApi
      .startQuiz(13)
      .then((response) => {
        setSession(response.data.sessionId);
      })
      .catch((err) => {});
    setTypeQuiz(type);
    setQuizId(quizId);
  };

  const columns = [
    {
      title: 'List Lesson',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <>
      <Header />
      <div style={{ backgroundColor: 'RGBA(0,0,87,0.23)' }}>
        <h3 style={{ textAlign: 'center' }}>{courseName}</h3>
        <div className="row" style={{ marginBottom: '20px', marginTop: '30px' }}>
          <div>
            {quizId === 'video' ? (
              <div
                style={{
                  marginTop: '20px',
                  marginLeft: '20px',
                }}
              >
                <Iframe src={url} width="830px" height="480px" />
              </div>
            ) : (
              <TakeQuiz quizId={quizId} type={typeQuiz} courseID={courseID} session={session} />
            )}
          </div>
          <div style={{ position: 'absolute', right: '0' }}>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              pagination={{ position: ['bottomLeft'] }}
              onRow={(record) => ({ onClick: () => navigate(`/viewLesson/${record.id}`) })}
              expandable={{
                expandedRowRender: (record) => {
                  const quiz = listQuiz.filter((quiz) => quiz.lesson.id === record.id);
                  if (quiz.length !== 0) {
                    return (
                      <div style={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                        <p style={{ textAlign: 'left', color: '#000' }}>
                          Quiz: {quiz[0].name}
                          <Button
                            style={{ width: '120px', marginLeft: '10px' }}
                            onClick={() => handleQuiz('Start', quiz[0].id)}
                          >
                            Start quiz
                          </Button>
                          <Button
                            style={{ width: '120px', marginLeft: '10px' }}
                            onClick={() => handleQuiz('View', quiz[0].id)}
                          >
                            View Best Quiz
                          </Button>
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div style={{ alignContent: 'center', justifyContent: 'center', display: 'flex' }}>
                        <Button style={{ textAlign: 'left', color: '#000' }} onClick={() => handleDone(record.id)}>
                          Click to complete
                        </Button>
                      </div>
                    );
                  }
                },
              }}
              dataSource={listLesson}
            />
          </div>
        </div>
      </div>

      <div className="lesson-list-post" style={{ justifyContent: 'left', marginLeft: '10px' }}>
        <p style={{ color: '#000', fontSize: '30px', textAlign: 'justify' }}>Comment</p>
        <Comment lessonId={id} />
        <Post />
      </div>

      <div style={{ marginTop: '250px' }}>
        <Footer />
      </div>
    </>
  );
}
