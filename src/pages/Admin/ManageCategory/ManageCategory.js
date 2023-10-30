import { Box } from '@mui/material';
import Header from '../../../components/Admin/Header/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import { Table, Space, Button } from 'antd';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';

export default function ManageCategory() {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const [user, setUser] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);
  useEffect(() => {
    authApi
      .findAllCategory()
      .then((response) => {
        const categoryArray = (response.data && response.data.categoryList) || [];
        setCategory(categoryArray);
      })
      .catch((error) => {});
  }, []);

  const handleEditClick = (categoryId) => {
    const categoryEdit = category.find((categorys) => categorys.id === parseInt(categoryId));
    setSelectedCategory(categoryEdit);
    navigate(`/editCategory/${categoryId}`);
  };

  const handleDeleteClick = (categoryId) => {
    const categoryToDelete = category.find((category) => category.id === parseInt(categoryId));
    setSelectedCategoryId(categoryToDelete.id);
    if (window.confirm('Do you want to delete this category?')) {
      const params = {
        username: user,
        categoryID: categoryId,
      };
      authApi
        .deleteCategory(params)
        .then((response) => {
          if (response.data && response.data.deleted) {
            setSuccessMessage('Delete Successfully!');
            setCategory(category.filter((category) => category.id !== categoryId));
          } else {
            setErrorMessage('Delete Failed!');
          }
        })
        .catch((error) => {
          setErrorMessage('Delete Failed!');
        });
    }
  };

  const handleAddCategoryClick = () => {
    navigate('/add-category');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '3%',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '40%',
      align: 'center',
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedAt',
      width: '20%',
      align: 'center',
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button onClick={() => handleEditClick(record.id)}>Edit</Button>
          <Button onClick={() => handleDeleteClick(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box m="20px">
          <Header title="Category" subtitle="List of Category" />
          <Button
            variant="contained"
            sx={{
              mb: 2,
              backgroundColor: '#1F883D',
              '&:hover': {
                backgroundColor: '#3D9E53',
              },
            }}
            onClick={handleAddCategoryClick}
          >
            Add Category
          </Button>
          <Table columns={columns} dataSource={category} rowKey={(record) => record.id} />
        </Box>
      </div>
    </div>
  );
}
