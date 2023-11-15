import React, { useEffect, useState } from 'react';
import './add.css'; // Import file CSS tùy chỉnh
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { Button } from 'antd';

const AddCourse = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [link_thumnail, setLinkThumnail] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [username, setUsername] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    if (localStorage.getItem('user-access-token')) {
      setUsername(jwtDecode(localStorage.getItem('user-access-token')).sub);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    authApi
      .findAllCategory()
      .then((response) => {
        const categoryArray = (response.data && response.data.categoryList) || [];
        if (categoryArray) {
          setCategory(categoryArray[0].name);
        }
        setCategories(categoryArray);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleThumbnailChange = (e) => {
    setLinkThumnail(e.target.value);
  };

  const handleThumbnailBlur = () => {
    setThumbnailPreview(link_thumnail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name && description && price && link_thumnail && category) {
      const params = {
        username: username,
        name,
        price,
        link_thumnail,
        category,
        description,
      };
      authApi
        .addCourse(params)
        .then((response) => {
          setMessage('Add Course Successful');
          setIsSuccess(true);
          setName('');
          setDescription('');
          setPrice('');
          setLinkThumnail('');
          setCategory('');
          setShowSuccessAlert(true);
          setShowErrorAlert(false);
        })
        .catch((error) => {
          setShowSuccessAlert(false);
          setShowErrorAlert(true);
        });
    } else {
      setShowSuccessAlert(false);
      setShowErrorAlert(true);
    }
  };

  const handleBackClick = () => {
    navigate('/manageCourse');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-course-container">
          <h2>Add Course</h2>
          {showSuccessAlert && (
            <Alert severity="success" sx={{ backgroundColor: 'lightblue', color: 'green' }}>
              Add Course Successful!
            </Alert>
          )}
          {showErrorAlert && (
            <Alert severity="error" sx={{ backgroundColor: 'lightcoral' }}>
              Fail to Add Course!
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input type="text" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="link_thumbnail">Link Thumbnail:</label>
              <input
                type="text"
                id="link_thumbnail"
                value={link_thumnail}
                onChange={handleThumbnailChange}
                onBlur={handleThumbnailBlur}
              />
            </div>
            {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" />}
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <Button
                type="submit"
                onClick={handleSubmit}
                style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
              >
                Add Course
              </Button>
              <Button
                type="button"
                onClick={handleBackClick}
                style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
              >
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
