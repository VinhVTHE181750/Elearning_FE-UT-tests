import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import './index.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import jwtDecode from 'jwt-decode';
import { Button, Table } from 'antd';
import Posts from './Post/Posts';

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .getCourseById(id)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error('Error fetching course by id:', error);
      });
  }, [id]);

  useEffect(() => {
    if (course) {
      authApi
        .getLessonByCourseId(course.id)
        .then((response) => {
          const lessonArray = (response.data && response.data.lessonList) || [];
          setLesson(lessonArray);
        })
        .catch((error) => {
          console.error('Error fetching lesson by id:', error);
        });
    }
  }, [course]);

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwtDecode(userString);
      setRole(deCoded.userInfo[0]);
      setUser(deCoded.sub);
    }
  }, []);

  useEffect(() => {
    if (user) {
      authApi
        .getPaymentUser(user)
        .then((response) => {
          const paymentArray = (response.data && response.data.listPayment) || [];
          setPayments(paymentArray);
        })
        .catch((error) => {
          console.error('Error fetching payments by username:', error);
        });
    }
  }, [user]);

  const handleViewLesson = (lessonId) => {
    if (!localStorage.getItem('user-access-token')) return navigate('/signin');
    if (payments.filter((payment) => payment.courseName === course.name).length !== 0 || role === 'ADMIN') {
      return navigate(`/viewLesson/${lessonId}`);
    } else {
      navigate(`/payment/${id}`);
    }
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'ordNumber',
      key: 'ordNumber',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      render: (record) => {
        if (payments.filter((payment) => payment.courseName === course.name).length !== 0 || role === 'ADMIN')
          return <Button onClick={() => handleViewLesson(record.id)}>View Lesson</Button>;
      },
    },
  ];

  return (
    <>
      <Header />
      <div className="course-details" style={{ marginTop: 50 }}>
        <h2>{course.name}</h2>
        <img src={course.linkThumnail} alt={course.name} />
        <p>{course.description}</p>
        <p style={{ color: '#000000e0', fontWeight: 'unset' }}>
          Price:{course.price && course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND
        </p>
        {(payments.filter((payment) => payment.courseName === course.name).length === 0 || role !== 'ADMIN') &&
          !course.deleted && (
            <Button style={{ color: 'black' }} onClick={() => navigate(`/payment/${id}`)}>
              Enroll Course
            </Button>
          )}
        <Table columns={columns} dataSource={lesson} rowKey={(record) => record.id} style={{ cursor: 'pointer' }} />
      </div>

      <div>
        <p style={{ color: 'black', fontSize: '30px', fontWeight: 'bold' }}>Comments</p>
        <Posts courseId={id} courseName={course.name} />
      </div>

      <Footer />
    </>
  );
}
