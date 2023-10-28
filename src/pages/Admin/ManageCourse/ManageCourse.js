import { Box, IconButton, InputBase } from '@mui/material';
import { tokens } from '../../../theme';
import Header from '../../../components/Admin/Header/Header';
import { useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { Table, Button, Space } from 'antd';
import moment from 'moment';

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
    navigate(`/viewCourse/${courseID}`);
  };
  const handleAddCourseClick = () => {
    navigate('/add-course');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '3%',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      align: 'center',
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '10%',
      align: 'center',
    },
    {
      title: 'Updated Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <a>{moment(record.createdAt).format('LLLL')}</a>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'action',
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
      <Header title="Courses" subtitle="List of Course" />

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

      <Table columns={columns} dataSource={courses} rowKey={(record) => record.id} />
    </Box>
  );
}
