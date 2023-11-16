import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
import jwtDecode from 'jwt-decode';
import { Box } from '@mui/material';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Button } from 'antd';
import { Alert } from '@mui/material';

const EditCourse = () => {
  const { courseID } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState([]);
  const [courses, setCourses] = useState([]);

  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [nameExistsError, setNameExistsError] = useState(false);

  // get course by id
  useEffect(() => {
    authApi
      .getCourseById(courseID)
      .then((response) => {
        console.log(response);
        setCategory({ categoryId: response.data.category.id, categoryName: response.data.category.name });
        setCourse(response.data);
      })
      .catch((err) => {});
  }, [courseID]);

  // find all course
  useEffect(() => {
    authApi
      .findAllCourse()
      .then((response) => {
        const courseArray = (response.data && response.data.listCourse) || [];
        console.log(courseArray);
        setCourses(courseArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // find all category
  useEffect(() => {
    authApi
      .findAllCategory()
      .then((response) => {
        console.log('data: ', response.data);
        const categoryArray = (response.data && response.data.categoryList) || [];
        console.log('Category: ', categoryArray);
        setCategories(categoryArray);
        console.log('Category state after update:', categoryArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    if (localStorage.getItem('user-access-token')) {
      setUsername(jwtDecode(localStorage.getItem('user-access-token')).sub);
    }
  }, [localStorage.getItem('user-access-token')]);

  const handleSaveClick = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const params = {
      username: username,
      courseID: courseID,
      name: course.name,
      description: course.description,
      price: course.price,
      link_thumnail: course.linkThumail,
      categoryID: course.category.id,
    };

    if (course.name) {
      const check = courses.find(
        (c) => c.category.id === params.categoryID && c.name === params.name && c.courseID !== params.courseID,
      );

      if (check) {
        setNameExistsError(true);
        return;
      }
    }

    authApi
      .updateCourse(params)
      .then((response) => {
        setShowSuccessAlert(true);
        setShowErrorAlert(false);
      })
      .catch((error) => {
        setShowSuccessAlert(false);
        setShowErrorAlert(true);
      });
  };
  const handleBackClick = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate('/manageCourse');
  };
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          {showSuccessAlert && (
            <Alert severity="success" sx={{ backgroundColor: 'lightblue', color: 'green' }}>
              Edit Course Successful!
            </Alert>
          )}
          {showErrorAlert && (
            <Alert severity="error" sx={{ backgroundColor: 'lightcoral' }}>
              Fail to Edit Course!
            </Alert>
          )}
          {nameExistsError && (
            <div className="error-message" style={{ color: 'red' }}>
              If you cannot edit, the name already exists
            </div>
          )}
          <h2>Edit Course</h2>
          {course && (
            <div className="form-container" style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  value={course.name}
                  onChange={(e) => setCourse({ ...course, name: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input
                  id="description"
                  type="text"
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  id="price"
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse({ ...course, price: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="link_thumnail">Link Thumbnail:</label>
                <input
                  id="link_thumnail"
                  type="text"
                  value={course.linkThumail}
                  onChange={(e) => setCourse({ ...course, linkThumail: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="thumbnail-preview">
                {course.linkThumail && (
                  <img src={course.linkThumail} alt="Thumbnail" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={category.categoryId}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                >
                  <option value={category.categoryId}>{category.categoryName}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Các trường thông tin khác */}

              <div>
                <Button
                  type="submit"
                  style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={handleBackClick}
                  style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
