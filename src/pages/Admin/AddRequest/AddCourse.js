import React, { useEffect, useState } from 'react';
import './add.css'; // Import file CSS tùy chỉnh
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';
import jwtDecode from 'jwt-decode';

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

  useEffect(() => {
    if (localStorage.getItem('user-access-token')) {
      setUsername(jwtDecode(localStorage.getItem('user-access-token')).sub);
    }
  }, [localStorage.getItem('user-access-token')]);

  useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name && description && price && link_thumnail && category) {
      const params = {
        username: username,
        name,
        price,
        link_thumnail,
        category, // Use the category state directly
        description,
      };
      console.log(params);
      authApi
        .addCourse(params)
        .then((response) => {
          // Handle the success response
          setMessage('Add Course Successful');
          setIsSuccess(true);
          console.log(response);
          // Reset the form fields
          setName('');
          setDescription('');
          setPrice('');
          setLinkThumnail('');
          setCategory('');
        })
        .catch((error) => {
          // Handle the error response
          setMessage('Fail Add course');
          setIsSuccess(false);
        });
    } else {
      setMessage('Đăng ký không thành công');
      setIsSuccess(false);
    }
  };
  console.log(category);
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-course-container">
          <h2>Add Course</h2>
          {message && <p className={`message ${isSuccess ? 'success' : 'error'}`}>{message}</p>}
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
                onChange={(e) => setLinkThumnail(e.target.value)}
              />
            </div>
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
            <button type="submit">Add Course</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
