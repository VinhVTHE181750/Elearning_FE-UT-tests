import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import jwtDecode from 'jwt-decode';
import authApi from '../../api/authApi';
import { Button, Result } from 'antd';
import './payment.css';
const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState([]);
  const [user, setUser] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    authApi
      .getCourseById(courseId)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error('Error fetching course by id:', error);
      });
  }, [courseId]);

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      const decoded = jwtDecode(userString);
      setUser(decoded.userInfo[0]);
      authApi
        .getPaymentUser(decoded.sub)
        .then((response) => {
          console.log(response.data);
          const paymentArray = (response.data && response.data.listPayment) || [];
          setPayments(paymentArray);
        })
        .catch((error) => {
          console.error('Error fetching payments by username:', error);
        });
    }
  }, []);

  const handleEnroll = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      const params = {
        courseId: courseId,
        username: jwtDecode(userString).sub,
      };
      console.log(params);
      if (
        payments.filter((payment) => payment.courseName === course.name).length !== 0 ||
        jwtDecode(userString).userInfo[0] === 'ADMIN'
      ) {
        return navigate(`/view-course/${courseId}`);
      }
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
    <>
      {' '}
      <Header />
      <div className="receipt">
        <h2 className="name">Your order information</h2>
        <hr />
        {/* Details */}
        <div className="details">
          <div className="product">
            <img
              className="img-Product"
              src="https://images.shiksha.com/mediadata/images/articles/1653376864phpNspXVa.jpeg"
              alt=""
            />
            <div className="info">
              <h4>Name Course: {course.name}</h4>
            </div>
          </div>
        </div>
        <div className="totalprice">
          <p className="del"></p>
          <hr />
          <p className="tot">
            Price <span> {course.price && course.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND</span>
          </p>
        </div>

        {/* Footer */}
        <footer>
          {' '}
          <button onClick={() => handleEnroll()}>Order Now</button>
        </footer>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
