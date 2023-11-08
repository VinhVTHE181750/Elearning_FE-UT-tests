import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import jwtDecode from 'jwt-decode';
import authApi from '../../api/authApi';

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState([]);

  useEffect(() => {
    authApi
      .getCourseById(courseId)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error('Error fetching course by id:', error);
      });
  }, [courseId]);

  const handleEnroll = () => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      const params = {
        courseId: courseId,
        username: jwtDecode(userString).sub,
      };
      console.log(params);
      authApi
        .enrollCourse(params)
        .then((response) => {
          const { orderId, urlPayment } = response.data;

          localStorage.setItem('paymentUrl', urlPayment);
          localStorage.setItem('orderID', orderId);
          window.location.replace(urlPayment);
        })
        .catch((error) => {
          console.error('Error enrolling course:', error);
        });
    } else return navigate('/signin');
  };

  return (
    <div>
      <Header />
      <h2>Your order information</h2>
      <div className="course-details" style={{ marginTop: '50px', marginBottom: '150px' }}>
        <h2>Name Course: {course.name}</h2>
        <p>Price:{course.price}VND</p>
      </div>
      <p>
        <button onClick={() => handleEnroll()}>Order Now</button>
      </p>

      <div style={{ position: 'fixed', bottom: '0', left: '0', zIndex: '1000', width: '100%', margin: '0' }}>
        <Footer />
      </div>
    </div>
  );
};

export default PaymentPage;
