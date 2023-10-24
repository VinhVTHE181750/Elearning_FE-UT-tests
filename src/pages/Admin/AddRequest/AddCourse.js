import React, { useState } from 'react';
import './add.css'; // Import file CSS tùy chỉnh
import authApi from '../../../api/authApi';

const AddCourse = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [link_thumnail, setLinkThumnail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (name && description && price && link_thumnail && category) {
      // Create the params object to send to the addCourse API
      const params = {
        name,
        price,
        link_thumnail,
        category,
        description,
      };

      authApi
        .addCourse(params)
        .then((response) => {
          // Handle the success response
          setMessage('Đăng kí thành công');
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
          setMessage('Đăng kí không thành công');
          setIsSuccess(false);
        });
    } else {
      setMessage('Đăng kí không thành công');
      setIsSuccess(false);
    }
  };

  return (
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
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
};

export default AddCourse;
