import { Box, Button, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Admin/Header/Header';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';

export default function ManageCategory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .findAllCategory()
      .then((response) => {
        console.log('data: ', response.data);
        const categoryArray = (response.data && response.data.categoryList) || [];
        setCategory(categoryArray);
        console.log('Category state after update:', categoryArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
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
        categoryID: categoryId,
      };
      authApi
        .deleteCategory(params)
        .then((response) => {
          if (response.data && response.data.deleted) {
            setSuccessMessage('Delete Successfully!');
            // Remove the deleted category from the category state
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
    { field: 'id', headerName: 'ID', width: 300 },
    { field: 'name', headerName: 'Name', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 300,
      renderCell: (params) => (
        <div>
          <Button
            aria-label="Edit"
            onClick={() => handleEditClick(params.row.id)}
            sx={{
              backgroundColor: 'green',
              color: 'white',
              width: 150,
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
              width: 150,
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
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
      <Box
        m="40px 0 0 0"
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
        <DataGrid checkboxSelection rows={category} columns={columns} />
      </Box>
    </Box>
  );
}
