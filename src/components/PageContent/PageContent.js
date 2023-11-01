import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './index.css';
import authApi from '../../api/authApi';
import PaymentPage from '../../pages/PaymentPage/PaymentPage';
import { error } from 'jquery';
import moment from 'moment';
import { Statistic } from 'antd';

export default function PageContent() {
  const [allCourses, setAllCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [user, setUser] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [payments, setPayments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [checkEnroll, setCheckEnroll] = useState(-1);

  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .findAllCourse()
      .then((response) => {
        const sortedAllCourses = response.data.listCourse.sort((a, b) => a.price - b.price);
        const topAllCourses = sortedAllCourses.slice(0, 5);
        setAllCourses(topAllCourses);
      })
      .catch((error) => {
        console.error('Error fetching top courses:', error);
      });
  }, []);

  useEffect(() => {
    authApi
      .getNewestCourse()
      .then((response) => {
        const sortedNewCourses = response.data.listCourse.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const topNewCourses = sortedNewCourses.slice(0, 5);
        setNewCourses(topNewCourses);
      })
      .catch((error) => {
        console.error('Error fetching newest courses:', error);
      });
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);

  const handleGetCourseById = (courseId) => {
    authApi
      .getCourseById(courseId)
      .then((response) => {
        setSelectedCourse(response.data);
      })
      .catch((error) => {
        console.error('Error fetching course by id:', error);
      });
  };

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
  const handleEnrollCourse = (courseId, courseName) => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      handleGetCourseById(courseId);
      const params = {
        courseId: courseId,
        username: user,
      };
      if (payments.filter((payment) => payment.courseName === courseName).length !== 0) {
        return navigate(`/view-course/${courseId}`);
      } else {
        authApi
          .enrollCourse(params)
          .then((response) => {
            const { orderId, urlPayment } = response.data;
            const url = urlPayment;
            const orderID = orderId;
            localStorage.setItem('paymentUrl', url);
            localStorage.setItem('orderID', orderID);
            setPaymentUrl(url);
            setEnrolled(true);
            navigate('/payment');
          })
          .catch((error) => {
            console.error('Error enrolling course:', error);
          });
      }
    } else return navigate('/signin');
  };

  const handleViewCourse = (id) => {
    return navigate(`/view-course/${id}`);
  };

  return (
    <div>
      <h2>Top 5 course</h2>
      <div className="homepage-content-course-list">
        {allCourses.map((course) => (
          <div key={course.id} className="course-card">
            <Link to={`/vew-course/${course.id}`} style={{ height: '250px' }}>
              <img
                src="https://images.shiksha.com/mediadata/images/articles/1653376864phpNspXVa.jpeg"
                alt={course.name}
              />
              <h3>{course.name}</h3>
              <p>Price:{course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND</p>
            </Link>
            <div className="page-content-button">
              <button onClick={() => handleEnrollCourse(course.id, course.name)}>Enroll Course</button>
              <button onClick={() => handleViewCourse(course.id)}>View Course</button>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '40px' }}>Top 5 new Course</h2>
      <div className="homepage-content-course-list">
        {newCourses.map((course) => (
          <div key={course.id} className="course-card">
            <Link to={`/view-course/${course.id}`} style={{ height: '250px' }}>
              <img
                src="https://images.shiksha.com/mediadata/images/articles/1653376864phpNspXVa.jpeg"
                alt={course.name}
              />
              <h3>{course.name}</h3>
              <p>Price:{course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND</p>
            </Link>
            <div className="page-content-button">
              <button onClick={() => handleEnrollCourse(course.id, course.name)}>Enroll Course</button>
              <button onClick={() => handleViewCourse(course.id)}>View Course</button>
            </div>
          </div>
        ))}
      </div>

      {paymentUrl && <PaymentPage paymentUrl={paymentUrl} />}
    </div>
  );
}
