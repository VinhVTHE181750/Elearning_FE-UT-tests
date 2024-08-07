import { Box } from '@mui/material';
import Header from '../../../components/Admin/Header/Header';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import { Table, Button, Space, Input } from 'antd';
import moment from 'moment';
import Sidebar from '../../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';

export default function ManageCourse() {
  const [courses, setCourse] = useState([]);
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [searchText, setSearchText] = useState('');
  // update searchText
  useEffect(() => {
    if (localStorage.getItem('user-access-token')) {
      setUsername(jwtDecode(localStorage.getItem('user-access-token')).sub);
    }
  }, [localStorage.getItem('user-access-token')]);
  // update searchText
  useEffect(() => {
    authApi
      .findAllCourse()
      .then((response) => {
        const courseArray = (response.data && response.data.listCourse) || [];
        setCourse(courseArray);
        const categoryArray = courseArray.map((course) => course.category.name);
        setCategories(categoryArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  // update searchText
  const handleEditClick = (courseID) => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/editCourse/${courseID}`);
  };
  // update searchText
  const handleDeleteClick = (courseID) => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    if (window.confirm('Do you want to delete this course?')) {
      const params = { username: username, courseID: courseID };
      authApi
        .deleteCourse(params)
        .then((response) => {
          if (response.data && response.data.deleted) {
            window.alert('Delete Successfully!');
            setSuccessMessage('Delete Successfully!');
            setCourse(courses.filter((course) => course.id !== courseID));
          } else {
            setErrorMessage('Delete Failed!');
          }
        })
        .catch((error) => {
          setErrorMessage('Delete Failed!');
        });
    }
  };
  // update searchText
  const handleViewClick = (courseID) => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate(`/viewCourse/${courseID}`);
  };

  const handleAddCourseClick = () => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate('/add-course');
  };
  const isInputValid = (input) => {
    // Kiểm tra xem input có chứa khoảng trắng không
    if (input.includes(' ')) {
      return false;
    }
    // Kiểm tra xem input có chứa ký tự đặc biệt không
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialChars.test(input)) {
      return false;
    }
    return true;
  };

  const handleSearch = (value) => {
    const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(value.toLowerCase()));
    if (value.trim() === '') {
      alert("Please can't value of course be empty");
    } else if (!isInputValid(value)) {
      alert('Please do not enter special characters!');
    } else if (filteredCourses.length === 0) {
      alert('Course not exist');
    } else {
      setSearchText(value);
    }
  };

  const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(searchText.toLowerCase()));

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
      title: 'Category',
      dataIndex: ['category', 'name'],
      width: '10%',
      align: 'center',
    },
    {
      title: 'Price',
      align: 'center',
      render: (record) => {
        return (
          <div>
            <p style={{ color: '#000000e0', fontWeight: 'unset' }}>
              {record.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}VND
            </p>
          </div>
        );
      },
      width: '10%',
    },
    {
      title: 'Updated Date',
      width: '10%',
      align: 'center',
      render: (record) => {
        const formatDate = moment(record.createdAt).format('MMMM Do YYYY, h:mm a');
        return <a>{formatDate}</a>;
      },
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
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}></div>
      <Box m="20px">
        <Header title="Manage Courses" subtitle="List of Course" />

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

        <Input.Search
          placeholder="Search by course name"
          allowClear
          onSearch={handleSearch}
          style={{ width: 200, marginBottom: 16 }}
        />

        <Table columns={columns} dataSource={filteredCourses} rowKey={(record) => record.id} />
      </Box>
    </div>
  );
}
