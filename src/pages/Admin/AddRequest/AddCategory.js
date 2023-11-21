import React, { useState, useEffect } from 'react';
import './add.css'; // Import file CSS tùy chỉnh
import authApi from '../../../api/authApi';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState([]);
  const [inputError, setInputError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin user từ local storage nếu có
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);

  useEffect(() => {
    // Lấy danh sách category từ API và set state
    authApi
      .findAllCategory()
      .then((response) => {
        const categoryArray = (response.data && response.data.categoryList) || [];
        setCategory(categoryArray);
      })
      .catch((error) => {});
  }, []);

  const handleBackClick = () => {
    // Quay lại trang quản lý category
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    navigate('/manageCategory');
  };

  const nameRegex = /^[a-zA-Z0-9]+[A-Za-zÀ-ỹ0-9!@#$%^&*(),.?":{}|<>':\s]+$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!localStorage.getItem('user-access-token')) {
      window.location.href = '/signin';
      return;
    }
    if (!name.trim()) {
      setInputError('Category Name cannot be blank.');
      setIsSuccess(false);
      return;
    } else if(!nameRegex.test(name.trim())) {
      setInputError('Error: Category Name is invalid.');
      setIsSuccess(false);
      return;
    }

    const check = category.find((c) => c.name === name);
    if (check) {
      setInputError('Category already exists!');
      setIsSuccess(false);
      return;
    }

    const params = {
      username: user,
      name,
    };

    authApi
      .addCategory(params)
      .then((response) => {
        setInputError('');
        setIsSuccess(true);
        setName(''); // Reset trường nhập liệu sau khi thêm thành công
        navigate('/manageCategory');
      })
      .catch((err) => {
        setInputError('Add Fail Category');
        setIsSuccess(false);
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="add-category-container">
          <h2>Add Category</h2>
          {isSuccess && <p className="message success">Add Successfully Category</p>}
          {!isSuccess && inputError && <p className="message error">Add Fail Category</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
              {inputError &&  <p  style={{ color: 'red' }}>{inputError}</p>}
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
