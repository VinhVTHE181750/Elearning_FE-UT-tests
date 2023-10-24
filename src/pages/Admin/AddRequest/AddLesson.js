import React, { useState } from 'react';
import './add.css';
import authApi from '../../../api/authApi';
function AddLesson() {
  const [lessonName, setLessonName] = useState('');
  const [ordNumber, setOrdNumber] = useState(0);
  const [courseID, setCourseID] = useState(0);
  const [linkContent, setLinkContent] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (lessonName && ordNumber && courseID && linkContent && description) {
      const params = {
        lessonName,
        ordNumber,
        courseID,
        linkContent,
        description,
      };
      authApi.addLesson(params).then((response) => {
        setMessage('Add Successfully Lesson');
        setIsSuccess(true);
      });
      // Đăng kí thành công
    } else {
      // Đăng kí thất bại
      setMessage('Add Fail Lesson');
      setIsSuccess(false);
    }

    // Sau khi xử lý xong, có thể reset giá trị trong form
    setLessonName('');
    setOrdNumber(0);
    setCourseID(0);
    setLinkContent('');
    setDescription('');
  };
  return (
    <div className="add-lesson-container">
      <h1>Add Lesson</h1>
      {message && <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Lesson Name:
          <input type="text" value={lessonName} onChange={(e) => setLessonName(e.target.value)} />
        </label>

        <label>
          Order Number:
          <input type="number" value={ordNumber} onChange={(e) => setOrdNumber(parseInt(e.target.value))} />
        </label>

        <label>
          Course ID:
          <input type="number" value={courseID} onChange={(e) => setCourseID(parseInt(e.target.value))} />
        </label>

        <label>
          Link Content:
          <input type="text" value={linkContent} onChange={(e) => setLinkContent(e.target.value)} />
        </label>

        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </label>

        <button type="submit" onClick={handleSubmit}>
          Add Lesson
        </button>
      </form>
    </div>
  );
}

export default AddLesson;
