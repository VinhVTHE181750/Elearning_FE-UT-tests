import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './edit.css';
import Sidebar from '../../../components/Sidebar/Sidebar';

const EditCourse = () => {
  const { courseID } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [editedCourse, setEditedCourse] = useState({
    name: '',
    description: '',
    price: 0,
    linkThumnail: '',
    categoryID: 0,
  });
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
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
    authApi
      .findAllCourse()
      .then((response) => {
        const courseArray = (response.data && response.data.listCourse) || [];
        const selectedCourse = courseArray.find((course) => course.id === parseInt(courseID));
        setCourse(selectedCourse);
        setEditedCourse({
          name: selectedCourse.name,
          description: selectedCourse.description,
          price: selectedCourse.price,
          linkThumnail: selectedCourse.linkThumnail,
          categoryID: selectedCourse.category.name,
        });
        console.log(selectedCourse);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [courseID]);

  const handleSaveClick = () => {
    const params = {
      courseID: courseID,
      name: editedCourse.name,
      description: editedCourse.description,
      price: editedCourse.price,
      link_thumnail: editedCourse.linkThumnail,
      categoryID: editedCourse.categoryID,
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
                  value={editedCourse.name}
                  onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input
                  id="description"
                  type="text"
                  value={editedCourse.description}
                  onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  id="price"
                  type="number"
                  value={editedCourse.price}
                  onChange={(e) => setEditedCourse({ ...editedCourse, price: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="link_thumnail">Link Thumbnail:</label>
                <input
                  id="link_thumnail"
                  type="text"
                  value={editedCourse.linkThumnail} // Thay đổi tên trường thành linkThumnail
                  onChange={(e) => setEditedCourse({ ...editedCourse, linkThumnail: e.target.value })} // Thay đổi tên trường thành linkThumnail
                  margin="normal"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={editedCourse.categoryID}
                  onChange={(e) => setEditedCourse({ ...editedCourse, categoryID: parseInt(e.target.value) })}
                  className="form-control"
                >
                  <option value={0}>Select a category</option>
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
