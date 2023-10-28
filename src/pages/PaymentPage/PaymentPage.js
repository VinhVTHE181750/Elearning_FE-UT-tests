import React, { useEffect } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const PaymentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const paymentUrl = localStorage.getItem('paymentUrl');
    console.log('paymentUrl:', paymentUrl);

    const handlePaymentResult = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const responseCode = urlParams.get('responseCode');

      if (responseCode === '00') {
        navigate('/payment-result/success');
      } else if (responseCode === '24') {
        navigate('/payment-result/failure');
      }
    };

    window.onpopstate = handlePaymentResult;

    return () => {
      window.onpopstate = null;
    };
  }, [navigate]);

  const paymentUrl = localStorage.getItem('paymentUrl');

  return (
    <div>
      <Header />
      <h2>Payment Page</h2>
      {paymentUrl && (
        <p>
          Thanh toán hoá đơn của bạn <a href={paymentUrl}>Tại Đây</a>
        </p>
      )}
    </div>
  );
};

export default PaymentPage;
