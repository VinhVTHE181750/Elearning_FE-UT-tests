import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import './index.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import jwtDecode from 'jwt-decode';
import { Table, Button } from 'antd';

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState('');

  const [paymentUrl, setPaymentUrl] = useState('');
  const [enrolled, setEnrolled] = useState(false);
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
      setUser(deCoded.sub);
    }
  }, []);

  useEffect(() => {
    if (user) {
      authApi
        .getPaymentUser(user)
        .then((response) => {
          console.log(response.data); // In ra dữ liệu trả về từ API
          const paymentArray = (response.data && response.data.listPayment) || [];
          setPayments(paymentArray);
        })
        .catch((error) => {
          console.error('Error fetching payments by username:', error);
        });
    }
  }, [user]);

  const handleViewLesson = (lessonId) => {
    const params = {
      courseId: id,
      username: user,
    };
    if (payments.filter((payment) => payment.courseName === course.name).length !== 0) {
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
  ];

  return (
    <>
      <Header />
      <div className="course-details" style={{ marginTop: '50px', marginBottom: '150px' }}>
        <h2>{course.name}</h2>
        <img src={course.linkThumnail} alt={course.name} />
        <p>{course.description}</p>
        <p>Price:{course.price}VND</p>

        <Table
          columns={columns}
          dataSource={lesson}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: () => handleViewLesson(record.id),
          })}
        />
      </div>

      <Footer />
    </>
  );
}
