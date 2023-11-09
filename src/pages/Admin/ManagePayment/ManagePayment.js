import React, { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import { Table, Button, Input, Pagination } from 'antd';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Box } from '@mui/material';
import moment from 'moment';

const ManagePayment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Số lượng hàng trên mỗi trang

  useEffect(() => {
    authApi.getAllPayment().then((response) => {
      const paymentArray = response.data.listPayment;
      console.log(paymentArray);
      setPayments(paymentArray);
      setFilteredPayments(paymentArray);
    });
  }, []);

  const handleSearch = (value) => {
    const filteredData = payments.filter((payment) => payment.courseName.toLowerCase().includes(value.toLowerCase()));
    setFilteredPayments(filteredData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1 + (currentPage - 1) * pageSize,
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredPayments.slice(startIndex, endIndex);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box m="20px">
          <div>
            <h1>Manage Payment</h1>
            <Input.Search
              placeholder="Search by course name"
              allowClear
              onSearch={handleSearch}
              style={{ marginBottom: 16 }}
            />
            <Table columns={columns} dataSource={paginatedData} pagination={false} />
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPayments.length}
              onChange={handlePageChange}
              style={{ marginTop: 16, textAlign: 'right' }}
            />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ManagePayment;
