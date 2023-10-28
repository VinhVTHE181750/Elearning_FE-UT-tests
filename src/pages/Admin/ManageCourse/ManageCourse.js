import { Box, Button, IconButton, InputBase } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from '../../../theme';
import Header from '../../../components/Admin/Header/Header';
import { useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';

export default function ManageCourse() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [courses, setCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    authApi
      .findAllCourse()
      .then((response) => {
        console.log('data: ', response.data);
        const courseArray = (response.data && response.data.listCourse) || [];
        setCourse(courseArray);
        console.log('Category state after update:', courseArray);
        const categoryArray = courseArray.map((course) => course.category.name);
        setCategories(categoryArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleEditClick = (courseID) => {
    const courseEdit = courses.find((course) => course.id === parseInt(courseID));
    setSelectedCourse(courseEdit);
    // Xử lý sự kiện khi nút Edit được nhấp, ví dụ: chuyển hướng đến trang chỉnh sửa user
    navigate(`/editCourse/${courseID}`);
  };

  const handleDeleteClick = (courseID) => {
    const courseToDelete = courses.find((course) => course.id === parseInt(courseID));
    setSelectedCourseId(courseToDelete.id);
    if (window.confirm('Do you want to delete this course?')) {
      const params = {
        courseID: courseID,
      };
      authApi
        .deleteCourse(params)
        .then((response) => {
          if (response.data && response.data.deleted) {
            setSuccessMessage('Delete Successfully!');
            // Remove the deleted course from the category state
            setCourse(courses.filter((course) => course.id !== courseID));
            setCourse((prevCourses) =>
              prevCourses.map((course, index) => ({
                ...course,
                id: index + 1,
              })),
            );
          } else {
            setErrorMessage('Delete Failed!');
          }
        })
        .catch((error) => {
          setErrorMessage('Delete Failed!');
        });
    }
  };

  const handleViewClick = (courseID) => {
    // Chuyển hướng đến trang ViewCourse với courseId được truyền vào
    navigate(`/viewCourse/${courseID}`);
  };
  const handleAddCourseClick = () => {
    navigate('/add-course');
  };
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      valueGetter: (params) => params.row.category.name,
    },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'createdAt', headerName: 'Created', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button
            aria-label="Edit"
            onClick={() => handleEditClick(params.row.id)}
            sx={{
              backgroundColor: 'green',
              color: 'white',
              width: '20px',
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
              width: '20px',
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
              backgroundColor: 'blue',
              color: 'white',
              width: '20px',
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
      <Header title="Courses" subtitle="List of Course" />

      <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
      <IconButton type="button" sx={{ p: 1 }}>
        <SearchIcon />
      </IconButton>
      <Button
        variant="contained"
        sx={{
          mb: 2,
          backgroundColor: '#1F883D',
          '&:hover': {
            backgroundColor: '#3D9E53',
          },
        }}
        onClick={handleAddCourseClick}
      >
        Add Courses
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
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={courses} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
}
