import React, { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import { Table, Button, Input, Pagination } from 'antd';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Box } from '@mui/material';
import moment from 'moment';

const ManagePayment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    authApi
      .getAllPayment()
      .then((response) => {
        const paymentArray = response.data.listPayment.map((payment, index) => ({
          ...payment,
          index: index + 1,
        }));
        console.log(paymentArray);
        setPayments(response.data.listPayment);
        setFilteredPayments(paymentArray);
      })
      .catch((err) => {});
  }, []);

  const handleSearch = (value) => {
    const filteredData = payments
      .filter((payment) => payment.username.toLowerCase().includes(value.toLowerCase()))
      .map((payment, index) => ({ ...payment, index: index + 1 }));
    setFilteredPayments(filteredData);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'User',
      dataIndex: 'username',
    },
    {
      title: 'Created At',
      key: 'createdAt',
      render: (record) => {
        const formatDate = moment(record.createdAt).format('MMMM Do YYYY, h:mm a');
        if (record.createdAt !== null) return <a>{formatDate}</a>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Amount',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <p style={{ color: '#000000e0', fontWeight: 'unset' }}>
              {record.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND
            </p>
          </div>
        );
      },
      width: '10%',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box m="20px">
          <div>
            <h1>Manage Payment</h1>
            <Input.Search
              placeholder="Search by username"
              allowClear
              onSearch={handleSearch}
              style={{ marginBottom: 16 }}
            />
            <Table columns={columns} dataSource={filteredPayments} />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ManagePayment;
