import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './index.css';
import authApi from '../../api/authApi';
import PaymentPage from '../../pages/PaymentPage/PaymentPage';
import { Button } from 'antd';
export default function PageContent() {
  const [allCourses, setAllCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [user, setUser] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [payments, setPayments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [listEnrollCourse, setListEnrollCourse] = useState([]);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [gender, setGender] = useState('MALE');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [userRole, setUserRole] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const getUserByUsername = async () => {
      if (user) {
        try {
          const response = await authApi.getUserByUserName(user);
          const userData = response.data.user;
          setEmail(userData.email);
          setFullName(userData.fullName);
          setPhoneNum(userData.phone);
          setGender(userData.gender);
          setDateOfBirth(userData.date_of_birth);
          setUserRole(userData.role); // Lưu trữ vai trò của người dùng
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    getUserByUsername();
  }, [user]);

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
      authApi
        .getCourseByUser(deCoded.sub)
        .then((resp) => {
          setListEnrollCourse(resp.data.listCourse);
        })
        .catch((err) => {});
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
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      handleGetCourseById(courseId);
      if (payments.filter((payment) => payment.courseName === courseName).length !== 0 || userRole === 'ADMIN') {
        return navigate(`/view-course/${courseId}`);
      } else {
        navigate(`/payment/${courseId}`);
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
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swp391elearningapplication.appspot.com/o/python-logo-4k-i6-3840x2160.jpg?alt=media&token=967ba490-fb8e-40b0-9e75-ce91b729f024"
              alt={course.name}
            />
            <h3>{course.name}</h3>
            <p>Price:{course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND</p>

            {!listEnrollCourse.find((courseEnroll) => courseEnroll.id === course.id) ? (
              <div className="page-content-button">
                <button onClick={() => handleEnrollCourse(course.id, course.name)}>Enroll Course</button>
                <button onClick={() => handleViewCourse(course.id)}>View Course</button>
              </div>
            ) : (
              <div>
                <Button onClick={() => handleViewCourse(course.id)}>Go to course</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: '40px' }}>Top 5 new Course</h2>
      <div className="homepage-content-course-list">
        {newCourses.map((course) => (
          <div key={course.id} className="course-card">
            <img
              src="https://images.shiksha.com/mediadata/images/articles/1653376864phpNspXVa.jpeg"
              alt={course.name}
            />
            <h3>{course.name}</h3>
            <p>Price:{course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND</p>

            {!listEnrollCourse.find((courseEnroll) => courseEnroll.id === course.id) ? (
              <div className="page-content-button">
                <button onClick={() => handleEnrollCourse(course.id, course.name)}>Enroll Course</button>
                <button onClick={() => handleViewCourse(course.id)}>View Course</button>
              </div>
            ) : (
              <div>
                <Button onClick={() => handleViewCourse(course.id)}>Go to course</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {paymentUrl && <PaymentPage paymentUrl={paymentUrl} />}
    </div>
  );
}
