import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './paymentSucess.css';

const PaymentVnPaySuccess = () => {
  const id = parseInt(localStorage.getItem('orderID'));
  const [search] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const vnp_ResponseCode = search.get('vnp_ResponseCode');
    const vnp_TransactionId = search.get('vnp_TransactionNo');

    if (id) {
      const params = {
        orderId: id,
        transactionId: vnp_TransactionId,
        responseCode: vnp_ResponseCode,
      };
      authApi
        .confirmPayment(params)
        .then((res) => {
          if (vnp_ResponseCode === '00') {
            setPaymentStatus('Thanh toán thành công khoá học');
          } else if (vnp_ResponseCode === '24') {
            setPaymentStatus('Thanh toán thất bại khoá học');
          } else if (res.data.status === 'Payment done') {
            setPaymentStatus('Confirm payment success');
          }
        })
        .catch((error) => {});
    } else {
    }
  }, []);

  return (
    <>
      <Header />
      <div className="payment-container">
        <div className="payment-status">{paymentStatus}</div>
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default PaymentVnPaySuccess;
