import { Box, useTheme, Button, IconButton, InputBase } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';

import { dataUser } from '../../../data/dataUser';
import Header from '../../../components/Admin/Header/Header';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

export default function ManageUser() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const negative = useNavigate(); // Sử dụng useNavigate thay vì useHistory
  const [users, setUsers] = useState(dataUser);
  const [selectedUser, setSelectedUser] = useState(null);
  // Xử lý sự kiện khi nút "Add User" được nhấp
  const handleAddUserClick = () => {
    negative('/form'); // Điều hướng sang trang "/form"
  };
  const handleEditClick = (userId) => {
    const userToEdit = users.find((user) => user.id === parseInt(userId));
    setSelectedUser(userToEdit);
    // Xử lý sự kiện khi nút Edit được nhấp, ví dụ: chuyển hướng đến trang chỉnh sửa user
    negative(`/editUser/${userId}`);
  };

  const handleDeleteClick = (userId) => {
    const updatedUsers = [...users];
    // Tìm vị trí của user cần xóa trong danh sách
    const userIndex = updatedUsers.findIndex((user) => user.id === userId);
    // Kiểm tra xem user có tồn tại trong danh sách hay không
    if (userIndex !== -1) {
      // Xóa user khỏi danh sách
      updatedUsers.splice(userIndex, 1);
      // Cập nhật lại ID của các người dùng còn lại
      updatedUsers.forEach((user, index) => {
        user.id = index + 1;
      });
      // Cập nhật lại danh sách users
      setUsers(updatedUsers);
    }
  };
  const handleViewClick = (userId) => {
    const userToView = users.find((user) => user.id === parseInt(userId));
    setSelectedUser(userToView);
    negative(`/view/${userId}`);
  };

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'fullName', headerName: 'Full Name', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'dob', headerName: 'DOB', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 1,
      headerAlign: 'center', // Căn giữa tiêu đề cột
      align: 'center', // Căn giữa nội dung trong cột
      headerTooltip: 'Actions', // Hiển thị tooltip cho tiêu đề cột
      renderHeader: () => (
        <div style={{ marginLeft: '20px' }}>Actions</div> // Lùi cột "Actions" lại
      ),

      renderCell: (params) => (
        <div>
          <Button
            aria-label="Edit"
            onClick={() => handleEditClick(params.row.id)}
            sx={{
              backgroundColor: 'green',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            }}
          >
            Edit
          </Button>
          <Button
            aria-label="Delete"
            onClick={() => handleDeleteClick(params.row.id)}
            sx={{
              backgroundColor: 'red',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            Delete
          </Button>
          <Button
            aria-label="View"
            onClick={() => handleViewClick(params.row.id)}
            sx={{
              backgroundColor: 'Blue',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="LIST USER" subtitle="Managing the User " />
      <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
      <IconButton type="button" sx={{ p: 1 }}>
        <SearchIcon />
      </IconButton>
      <Box m="20px"></Box>
      <Box
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={users} columns={columns} />
      </Box>
    </Box>
  );
}
