import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Table, Button } from 'antd';
import authApi from '../../api/authApi';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import moment from 'moment';

const MyPayment = () => {
  const [user, setUser] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
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

  const columns = [
    {
      title: 'Created At',
      key: 'createdAt',
      render: (record) => {
        const formatDate = moment(record.createdAt).format('MMMM Do YYYY, h:mm a');
        return <a>{formatDate}</a>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
  ];

  return (
    <div>
      <Header />
      <h1>My Payment</h1>
      <Table columns={columns} dataSource={payments} />
      <Footer />
    </div>
  );
};

export default MyPayment;
