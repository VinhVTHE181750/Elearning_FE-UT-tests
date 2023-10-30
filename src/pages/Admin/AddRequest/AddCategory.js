import React, { useState } from 'react';
import './add.css'; // Import file CSS tùy chỉnh
import authApi from '../../../api/authApi';
import Sidebar from '../../../components/Sidebar/Sidebar';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name) {
      const params = {
        name,
      };
      authApi.addCategory(params).then((response) => {
        setMessage('Add Successfully Category');
        setIsSuccess(true);
      });
      // Đăng kí thành công
    } else {
      // Đăng kí thất bại
      setMessage('Add Fail Category');
      setIsSuccess(false);
    }

    // Sau khi xử lý xong, có thể reset giá trị trong form
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
            <button type="submit">Add Category</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
