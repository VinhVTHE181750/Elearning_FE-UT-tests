import { Box } from '@mui/material';
import Header from '../../../components/Admin/Header/Header';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Button } from 'antd';
import { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import moment from 'moment';

export default function ManageUser() {
  const negative = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    authApi
      .getAllUser()
      .then((response) => {
        setUsers(response.data.userList);
      })
      .catch((err) => {});
  }, []);

  const handleEditClick = (userId) => {
    negative(`/editUser/${userId}`);
  };

  const handleDeleteClick = (userId) => {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      updatedUsers.splice(userIndex, 1);
      updatedUsers.forEach((user, index) => {
        user.id = index + 1;
      });
      setUsers(updatedUsers);
    }
  };
  const handleViewClick = (userId) => {
    negative(`/view/${userId}`);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '3%',
      align: 'center',
    },
    {
      title: 'Fullname',
      dataIndex: 'fullName',
      width: '20%',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Date of birth',
      dataIndex: 'date_of_birth',
      width: '20%',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <a>{moment(record.date_of_birth).format('L')}</a>
          </div>
        );
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '5%',
      align: 'center',
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button style={{ width: '80px' }} onClick={() => handleViewClick(record.id)}>
            View
          </Button>
          <Button style={{ width: '80px' }} onClick={() => handleEditClick(record.id)}>
            Edit
          </Button>
          <Button style={{ width: '80px' }} onClick={() => handleDeleteClick(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="LIST USER" subtitle="Managing the User " />
      <Table columns={columns} dataSource={users} rowKey={(record) => record.id} />
    </Box>
  );
}
