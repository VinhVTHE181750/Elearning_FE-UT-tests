import React, { useState } from 'react';
import './Styles/AddComment.scss';
import authApi from '../../../api/authApi';

const AddComment = ({ buttonValue, addComments }) => {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const clickHandler = () => {
    if (content === '' || content.trim() === '') return;

    const newComment = {
      email: 'hoanghiep310102@gmail.com', // Update with appropriate email
      lessonID: 1, // Update with appropriate lesson ID
      content,
      
    };

    authApi.addComments(newComment).then((response) => {
      setMessage('Add Successfully Post');
      setIsSuccess(true);
      console.log(response);
    });
    addComments(newComment)
    setContent('');
  };

  return (
    <div className="add-comment">
      <div className="profile-pic"></div>
      <textarea
        className="comment-input"
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="send-btn-container">
        <div className="profile-pic"></div>
        <button className="add-btn" onClick={clickHandler}>
          {buttonValue}
        </button>
      </div>
    </div>
  );
};

export default AddComment;
