import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrafficIcon from '@mui/icons-material/Traffic';
import Header from '../../../components/Admin/Header/Header';
import StatBox from '../../../components/Admin/StatBox';
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Charts from './Charts/Charts';
import moment from 'moment';
import { tokens } from '../../../theme';
import { Select } from 'antd';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalUser, setTotalUser] = useState('');
  const [totalCoure, setTotalCourse] = useState('');
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('2023');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [transaction, setTranscation] = useState([]);
  const [listCourse, setListCourse] = useState([]);
  const [listSelectCourse, setListSelectCourse] = useState([]);

  useEffect(() => {
    authApi
      .getAllPayment()
      .then((response) => {
        const paymentArray = response.data.listPayment;
        setPayments(paymentArray);
        setFilteredPayments(paymentArray);
      })
      .catch((err) => {});

    authApi
      .findAllCourse()
      .then((resp) => {
        setListCourse(resp.data.listCourse);
        const newListSelectCourse = resp.data.listCourse.map((course) => ({
          value: course.id,
          label: course.name,
        }));
        setListSelectCourse(newListSelectCourse);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    console.log(selectedCourse);
    if (!selectedCourse) {
      authApi
        .getPaymentByMonthYear({ month, year })
        .then((resp) => {
          setTranscation(resp.data.revenueForMonth);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      authApi
        .getPaymentByCourse({ courseId: selectedCourse, year })
        .then((resp) => {
          setTranscation(resp.data.revenueForMonth);
        })
        .catch((err) => {});
    }
  }, [year, selectedCourse]);

  const recentTransactions = payments.slice(0, 5);

  const totalTransactionValue = transaction.reduce((total, currentTransaction) => {
    return total + currentTransaction;
  }, 0);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box m="20px">
          {/* HEADER */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            <Box></Box>
          </Box>

          {/* GRID & CHARTS */}
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
            {/* ROW 1 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={totalUser}
                subtitle="Total User"
                progress="0.75"
                increase="+14%"
                icon={<PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
              />
            </Box>

            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={listCourse.length}
                subtitle="Total Course"
                progress="0.80"
                increase="+43%"
                icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
              />
            </Box>

            {/* ROW 2 */}
            <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]}>
              <Box mt="25px" p="0 30px" display="flex " justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                    Revenue Generated
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                    {(totalTransactionValue / 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND
                  </Typography>
                </Box>
              </Box>

              <Box mt="25px" p="0 30px" display="flex " alignItems="center" marginBottom="40px">
                <Box>
                  <label htmlFor="year-select" style={{ color: '#fff' }}>
                    Select Year:{' '}
                  </label>
                  <select id="year-select" value={year} onChange={handleYearChange}>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                  </select>
                  <br />
                  <label htmlFor="course-select" style={{ color: '#fff' }}>
                    Select Course:{' '}
                  </label>
                  <Select
                    showSearch
                    placeholder="Select a course"
                    optionFilterProp="children"
                    onChange={handleCourseChange}
                    onClear
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    options={listSelectCourse}
                    style={{ width: '500px' }}
                  />
                </Box>
              </Box>

              <Box height="250px" m="-50px 0 0 0">
                {transaction.length && <Charts list={transaction} />}
              </Box>
            </Box>

            <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                colors={colors.grey[100]}
                p="15px"
              >
                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                  Recent Transactions
                </Typography>
              </Box>
              {recentTransactions.map((transaction, i) => (
                <Box
                  key={`${transaction.txId}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography color={colors.grey[100]}> {transaction.courseName}</Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{moment(transaction.createdAt).format('MMMM Do YYYY, h:mm a')}</Box>
                  <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                    {transaction.amount}VND
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
