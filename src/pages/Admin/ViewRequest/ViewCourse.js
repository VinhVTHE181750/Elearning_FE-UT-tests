import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewCourse.css';
import authApi from '../../../api/authApi';
import { Button, Space, Table } from 'antd';
import moment from 'moment';

const ViewCourse = () => {
  const { courseID } = useParams();
  const [courseToView, setCourseToView] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .getCourseById(courseID)
      .then((response) => {
        setCourseToView(response.data);
      })
      .catch((error) => {});
  }, [courseID]);

  useEffect(() => {
    if (courseToView) {
      authApi
        .getLessonByCourseId(courseToView.id)
        .then((response) => {
          setLessons(response.data.lessonList);
        })
        .catch((error) => {});
    }
  }, [courseToView]);

  useEffect(() => {
    authApi
      .findAllQuiz()
      .then((response) => {
        setQuizzes(response.data.quizList);
      })
      .catch((error) => {});
  }, []);

  const handleAddLesson = () => {
    navigate('/add-lesson');
  };

  const handleDeleteLesson = (lessonID) => {
    if (window.confirm('Do you want to delete this lesson?')) {
      authApi
        .deleteLesson(lessonID)
        .then((response) => {
          setLessons(lessons.filter((lesson) => lesson.id !== lessonID));
          setLessons((prevLessons) => prevLessons.map((lesson, index) => ({ ...lesson, id: index + 1 })));
        })
        .catch((error) => {});
    }
  };

  const handleEditLesson = (id) => {
    navigate(`/edit-lesson/${id}`);
  };
  const handleViewLesson = (id) => {
    navigate(`/viewLesson/${id}`);
  };

  const handleEditQuiz = (id) => {
    navigate(`/edit-quiz/${id}`);
  };

  const handleDeleteQuiz = (quizID) => {
    if (window.confirm('Do you want to delete this quiz?')) {
      authApi
        .deleteQuiz(quizID)
        .then((response) => {
          setQuizzes(quizzes.filter((quiz) => quiz.id !== quizID));
          setQuizzes((prevQuizzes) => prevQuizzes.map((quiz, index) => ({ ...quiz, id: index + 1 })));
        })
        .catch((error) => {});
    }
  };
  const handleViewQuiz = (id) => {
    navigate(`/view-quiz/${id}`);
  };
  const handleAddQuiz = (id) => {
    navigate(`/add-quiz/${id}`);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'ordNumber',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <a>{moment(record.createdAt).format('LLLL')}</a>
          </div>
        );
      },
    },
    {
      title: 'Link Content',
      dataIndex: 'linkContent',
      align: 'center',
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button style={{ width: '80px' }} onClick={() => handleViewLesson(record.id)}>
            View
          </Button>
          <Button style={{ width: '80px' }} onClick={() => handleEditLesson(record.id)}>
            Edit
          </Button>
          <Button style={{ width: '80px' }} onClick={() => handleDeleteLesson(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="view-course-container">
      {courseToView ? (
        <div>
          <h1>Course Details</h1>
          <div className="course-details">
            <p>
              <span className="label">Name:</span> {courseToView.name}
            </p>
            <p>
              <span className="label">Description:</span> {courseToView.description}
            </p>
            <p>
              <span className="label">Category:</span> {courseToView.category.name}
            </p>
            <p>
              <span className="label">Created:</span> {courseToView.createdAt}
            </p>
            <p>
              <span className="label">Price:</span> {courseToView.price}
            </p>
          </div>
        </div>
      ) : (
        <div>Loading course details...</div>
      )}

      <h2>List Lesson</h2>
      <button onClick={handleAddLesson}>Add Lesson</button>

      <Table
        columns={columns}
        dataSource={lessons}
        rowKey={(record) => record.id}
        expandable={{
          expandedRowRender: (record) => {
            const columns = [
              {
                title: 'Name Quiz',
                dataIndex: 'name',
                align: 'center',
              },
              {
                title: 'Create At',
                dataIndex: 'createdAt',
                align: 'center',
              },
              {
                title: 'Actions',
                align: 'center',
                render: (_, record) => (
                  <Space size="small">
                    <Button style={{ width: '80px' }} onClick={() => handleViewQuiz(record.id)}>
                      View
                    </Button>
                    <Button style={{ width: '80px' }} onClick={() => handleEditQuiz(record.id)}>
                      Edit
                    </Button>
                    <Button style={{ width: '80px' }} onClick={() => handleDeleteQuiz(record.id)}>
                      Delete
                    </Button>
                  </Space>
                ),
              },
            ];
            const quiz = quizzes.filter((quiz) => quiz.lesson.id === record.id);
            if (quiz.length !== 0) {
              return (
                <>
                  <p style={{ color: '#000' }}>Description: {record.description}</p>
                  <Table columns={columns} dataSource={quiz} rowKey={(record) => record.id} pagination={false} />
                </>
              );
            }
            return (
              <>
                <p style={{ color: '#000' }}>Description: {record.description}</p>
                <Button style={{ marginLeft: '40%' }} onClick={() => handleAddQuiz(record.id)}>
                  Add new quiz
                </Button>
              </>
            );
          },
        }}
      />
    </div>
  );
};

export default ViewCourse;
