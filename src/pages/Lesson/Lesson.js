import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authApi from '../../api/authApi';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import Iframe from 'react-iframe';
import { Divider, List, Typography, Table } from 'antd';
import Column from 'antd/es/table/Column';

export default function Lesson() {
  const [listLesson, setListLesson] = useState([]);
  const [currentLesson, setCurrentLesson] = useState([]);
  const [listQuiz, setListQuiz] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [url, setUrl] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .getLessonById(id)
      .then((response) => {
        setCurrentLesson(response.data);
        setUrl(response.data.linkContent);
        setCourseID(response.data.course.id);
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

  const columns = [
    {
      title: 'List Lesson',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const handleViewLesson = (lessonId) => {
    // check lesson id is ok
    return navigate(`/viewLesson/${lessonId}`);
  };

  const handleTakeQuiz = (quizId) => {
    return navigate(`/takeQuiz/${quizId}`);
  };

  const handleDone = (lessonId) => {};

  return (
    <>
      <Header />
      <div className="row" style={{ marginBottom: '150px', marginTop: '50px' }}>
        <div style={{ marginLeft: '120px' }}>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            pagination={{
              position: ['bottomLeft'],
            }}
            onRow={(record) => ({
              onClick: () => handleViewLesson(record.id),
            })}
            expandable={{
              expandedRowRender: (record) => {
                const quiz = listQuiz.filter((quiz) => quiz.lesson.id === record.id);
                if (quiz.length !== 0) {
                  return (
                    <p style={{ textAlign: 'left', color: '#000' }} onClick={() => handleTakeQuiz(quiz[0].id)}>
                      Quiz: {quiz[0].name}
                    </p>
                  );
                } else {
                  return (
                    <p style={{ textAlign: 'left', color: '#000' }} onClick={() => handleDone(record.id)}>
                      Lesson done
                    </p>
                  );
                }
              },
            }}
            dataSource={listLesson}
          />
        </div>

        <div className="col-md-6" style={{ marginTop: '30px' }}>
          <Iframe src={url} width="480px" height="320px" />
        </div>
      </div>

      <Footer />
    </>
  );
}
