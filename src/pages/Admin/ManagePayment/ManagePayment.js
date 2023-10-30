import React, { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import { Table, Button } from 'antd';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Box } from '@mui/material';

const ManagePayment = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    authApi.getAllPayment().then((response) => {
      const paymentArray = response.data.listPayment;
      setPayments(paymentArray);
    });
  }, []);

  const columns = [
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box m="20px">
          <div>
            <h1>Manage Payment</h1>
            <Table columns={columns} dataSource={payments} />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ManagePayment;
