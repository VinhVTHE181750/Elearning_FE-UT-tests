import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
import jwtDecode from 'jwt-decode';
import { Box } from '@mui/material';
import Sidebar from '../../../components/Sidebar/Sidebar';

const EditCourse = () => {
  const { courseID } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState([]);
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
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
  useEffect(() => {
    authApi
      .findAllCategory()
      .then((response) => {
        console.log('data: ', response.data);
        const categoryArray = (response.data && response.data.categoryList) || [];
        setCategories(categoryArray);
        console.log('Category state after update:', categoryArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem('user-access-token')) {
      setUsername(jwtDecode(localStorage.getItem('user-access-token')).sub);
    }
  }, [localStorage.getItem('user-access-token')]);

  const handleSaveClick = () => {
    const params = {
      username: username,
      courseID: courseID,
      name: course.name,
      description: course.description,
      price: course.price,
      link_thumnail: course.linkThumail,
      categoryID: course.category.id,
    };
    authApi
      .updateCourse(params)
      .then((response) => {
        setSuccessMessage('Course updated successfully.');
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage('Error updating course.');
        setSuccessMessage(null);
        console.error('Error updating course:', error);
      });
  };
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          <h2>Edit Course</h2>
          {course && (
            <div className="form-container" style={{ maxWidth: '400px' }}>
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
                  value={course.linkThumail} // Thay đổi tên trường thành linkThumnail
                  onChange={(e) => setCourse({ ...course, linkThumail: e.target.value })} // Thay đổi tên trường thành linkThumnail
                  margin="normal"
                />
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
              {successMessage && <div className="success-message">{successMessage}</div>}
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <button type="submit" className="btn btn-primary" onClick={handleSaveClick}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
