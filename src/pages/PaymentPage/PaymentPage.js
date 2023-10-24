import React, { useEffect } from 'react';

const PaymentPage = () => {
  useEffect(() => {
    const paymentUrl = localStorage.getItem('paymentUrl'); // Lấy giá trị paymentUrl từ localStorage
    console.log('paymentUrl:', paymentUrl);
  }, []);

  const paymentUrl = localStorage.getItem('paymentUrl'); // Lấy giá trị paymentUrl từ localStorage

  return (
    <div>
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
