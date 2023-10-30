import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const PaymentVnPaySuccess = () => {
  const id = parseInt(localStorage.getItem('orderID'));
  console.log('orderId', id);
  const [search] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const vnp_ResponseCode = search.get('vnp_ResponseCode');
    const vnp_TransactionId = search.get('vnp_TransactionNo');
    console.log(vnp_ResponseCode);
    console.log(vnp_TransactionId);

    if (id) {
      const params = {
        orderId: id,
        transactionId: vnp_TransactionId,
        responseCode: vnp_ResponseCode,
      };
      console.log(params);
      authApi
        .confirmPayment(params)
        .then((res) => {
          console.log(res);
          if (vnp_ResponseCode === '00') {
            setPaymentStatus('Thanh toán thành công khoá học');
          } else if (vnp_ResponseCode === '24') {
            setPaymentStatus('Thanh toán thất bại khoá học');
          } else if (res.data.status === 'Payment done') {
            setPaymentStatus('Confirm payment success');
          }
        })
        .catch((error) => {
          console.log('Không tìm thấy dữ liệu thanh toán');
          console.error(error);
        });
    } else {
      console.log('Không tìm thấy orderId');
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
