import React, { useState } from 'react';
import './add.css'; // Import file CSS tùy chỉnh
import authApi from '../../../api/authApi';
import jwt_decode from 'jwt-decode';
import { useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
const AddCategory = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState([]);

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);
  console.log('user: ', user);

  useEffect(() => {
    authApi
      .findAllCategory()
      .then((response) => {
        const categoryArray = (response.data && response.data.categoryList) || [];
        setCategory(categoryArray);
      })
      .catch((error) => {});
  }, []);

  const handleBackClick = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate('/manageCategory');
  };
  const isValidFullName = (name) => {
    const pattern = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/; // Biểu thức chính quy để kiểm tra tên đầy đủ
    return pattern.test(name);
  };
  const handleSubmit = (e) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    if (!isValidFullName(name)) {
      // Hiển thị thông báo lỗi nếu tên đầy đủ không hợp lệ

      return window.alert('Please Fill in full information of name not blanks and special characters');
    }
    e.preventDefault();

    if (name) {
      const check = category.find((c) => c.name === name);

      if (check) {
        window.alert('Category already exists!');
        return;
      }

      const params = {
        username: user,
        name,
      };

      authApi
        .addCategory(params)
        .then((response) => {
          setMessage('Add Successfully Category');
          setIsSuccess(true);
        })
        .catch((err) => {
          setMessage('Add Fail Category');
          setIsSuccess(false);
        });
    } else {
      setMessage('Add Fail Category');
      setIsSuccess(false);
    }

    setName('');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-category-container">
          <h2>Add Category</h2>
          {message && <p className={`message ${isSuccess ? 'success' : 'error'}`}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={{ display: 'flex' }}>
              <Button
                type="submit"
                onClick={handleSubmit}
                style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
              >
                Add Category
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

export default AddCategory;
