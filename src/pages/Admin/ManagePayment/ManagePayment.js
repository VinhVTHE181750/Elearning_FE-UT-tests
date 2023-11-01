import React, { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import { Table, Button } from 'antd';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Box } from '@mui/material';
import moment from 'moment';

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
      render: (record) => {
        if (record.updatedAt !== null)
          return (
            <div>
              <a>{moment(record.createdAt).format('DD/MM/YYYY, h:mm a')}</a>
            </div>
          );
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
            <Table columns={columns} dataSource={payments} />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ManagePayment;
