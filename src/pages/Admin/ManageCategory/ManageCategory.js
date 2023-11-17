import { Box } from '@mui/material';
import Header from '../../../components/Admin/Header/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import { Table, Space, Button } from 'antd';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';
import moment from 'moment';

export default function ManageCategory() {
  const [category, setCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchText, setSearchText] = useState('');
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
        const filteredCategories = categoryArray.filter((category) =>
          category.name.toLowerCase().includes(searchText.toLowerCase().trim()),
        );
        setCategory(filteredCategories);
      })
      .catch((error) => {});
  }, [searchText]);

  const handleEditClick = (categoryId) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const categoryEdit = category.find((categorys) => categorys.id === parseInt(categoryId));
    navigate(`/editCategory/${categoryId}`);
  };

  const handleDeleteClick = (categoryId) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <input
            type="text"
            placeholder="Search name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
        </div>
      ),
      filterIcon: () => null,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
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
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box m="20px">
          <Header title="Category" subtitle="List of Category" />
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search by name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginRight: '10px', width: '200px' }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1F883D',
                '&:hover': {
                  backgroundColor: '#3D9E53',
                },
              }}
              style={{ width: '120px' }}
              onClick={handleAddCategoryClick}
            >
              Add Category
            </Button>
          </div>
          <Table columns={columns} dataSource={category} rowKey={(record) => record.id} />
        </Box>
      </div>
    </div>
  );
}
