import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './index.css';
import authApi from '../../api/authApi';
import PaymentPage from '../../pages/PaymentPage/PaymentPage';

export default function PageContent() {
  const [allCourses, setAllCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [user, setUser] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [returnUrl, setReturnUrl] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy danh sách khoá học hàng đầu
    authApi
      .findAllCourse()
      .then((response) => {
        setAllCourses(response.data.listCourse);
      })
      .catch((error) => {
        console.error('Error fetching top courses:', error);
      });
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      console.log('decode: ', deCoded);
      setUser(deCoded.sub);
    }
  }, []);

  const handleEnrollCourse = (courseId) => {
    const params = {
      courseId: courseId,
      username: user,
    };
    console.log(courseId);
    authApi
      .enrollCourse(params)
      .then((response) => {
        const { orderId, urlPayment } = response.data;
        console.log('Enroll Course Success:', orderId, urlPayment);
        const url = urlPayment;
        console.log({ url });
        localStorage.setItem('paymentUrl', url);
        setPaymentUrl(url);
        console.log('paymentUrl: ', url);
        navigate('/payment'); // Điều hướng đến trang thanh toán
      })
      .catch((error) => {
        console.error('Error enrolling course:', error);
      });
  };

  return (
    <div>
      <h2>All Course</h2>
      <div className="course-list">
        {allCourses.map((course) => (
          <div key={course.id} className="course-card">
            <Link to={`/lesson/${course.id}`}>
              <img src={course.linkThumnail} alt={course.name} />
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p>Price: {course.price}</p>
            </Link>
            <button onClick={() => handleEnrollCourse(course.id)}>Enroll Course</button>
          </div>
        ))}
      </div>

      <h2>New Course</h2>
      <div className="course-list">
        {newCourses.map((course) => (
          <div key={course.id} className="course-card">
            <Link to={`/lesson/${course.id}`}>
              <img src={course.linkThumnail} alt={course.name} />
              <h3>{course.name}</h3>
              <p>{course.description}</p>
            </Link>
            <button onClick={() => handleEnrollCourse(course.id)}>Enroll Course</button>
          </div>
        ))}
      </div>

      {paymentUrl && <PaymentPage paymentUrl={paymentUrl} />}
    </div>
  );
}
