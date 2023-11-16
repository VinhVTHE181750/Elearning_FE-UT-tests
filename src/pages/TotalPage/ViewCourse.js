import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewCourse.css';
import authApi from '../../api/authApi';
import { Button, Space, Table, Input } from 'antd';
import moment from 'moment';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';

const ViewCourse = () => {
  const { courseID } = useParams();
  const [courseToView, setCourseToView] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const [user, setUser] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);

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
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/add-lesson/${courseID}`);
  };

  const handleDeleteLesson = (lessonID) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    console.log(lessonID);

    if (window.confirm('Do you want to delete this lesson?')) {
      authApi
        .deleteLesson({ username: jwtDecode(localStorage.getItem('user-access-token')).sub, lessonID })
        .then((response) => {
          setLessons(lessons.filter((lesson) => lesson.id !== lessonID));
          setLessons((prevLessons) => prevLessons.map((lesson, index) => ({ ...lesson, id: index + 1 })));
        })
        .catch((error) => {});
    }
  };

  const handleEditLesson = (id) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/edit-lesson/${id}`);
  };

  const handleViewLesson = (id) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/viewLesson/${id}`);
  };

  const handleEditQuiz = (id) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/edit-quiz/${id}`);
  };

  const handleDeleteQuiz = (quizID) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const params = {
      username: user,
      quizID,
    };
    if (window.confirm('Do you want to delete this quiz?')) {
      authApi
        .deleteQuiz(params)
        .then((response) => {
          setQuizzes(quizzes.filter((quiz) => quiz.id !== quizID));
          setQuizzes((prevQuizzes) => prevQuizzes.map((quiz, index) => ({ ...quiz, id: index + 1 })));
        })
        .catch((error) => {});
    }
  };

  const handleViewQuiz = (id) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/view-quiz/${id}`);
  };

  const handleAddQuiz = (id) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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
      align: 'center',
      render: (record) => {
        const formatDate = moment(record.createdAt).format('MMMM Do YYYY, h:mm a');
        return <a>{formatDate}</a>;
      },
      width: '20%',
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

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredLessons = lessons.filter((lesson) => lesson.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                  <span className="label">
                    Price:{courseToView.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div>Loading course details...</div>
          )}

          <h2>List Lesson</h2>
          <Button onClick={handleAddLesson} style={{ width: '100px' }}>
            Add Lesson
          </Button>
          <Input.Search
            placeholder="Search by lesson name"
            allowClear
            onSearch={handleSearch}
            style={{ width: 200, marginBottom: 16 }}
          />
          <Table
            columns={columns}
            dataSource={filteredLessons}
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
                    align: 'center',
                    width: '20%',
                    render: (record) => {
                      const formatDate = moment(record.createdAt).format('MMMM Do YYYY, h:mm a');
                      return <a>{formatDate}</a>;
                    },
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
      </div>
    </div>
  );
};

export default ViewCourse;
