import "./Styles/DeleteModal.scss";
import authApi from '../../../api/authApi';
import { useState } from 'react';

const DeleteModal = ({ setDeleting,deleteComment, commentDelete, commentData, setDeleteModalState }) => {
  const cancelDelete = () => {
    setDeleting(false);
    setDeleteModalState(false);
  };

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const deleteBtnClick = () => {
  
        const params = {
            email: 'hoanghiep310102@gmail.com',
            lessonID: 1,
        };
        authApi
            .deleteComments(params)
            .then((response) => {
                if (response.data && response.data.deleted) {
                    setSuccessMessage('Delete Successfully!');
                    setErrorMessage(null);
                } else {
                    setErrorMessage('Delete Failed!');
                    setSuccessMessage(null);
                }
            })
            .catch((error) => {
                setErrorMessage('Delete Failed!');
                console.error('Error deleting comment:', error);
            });

        // Gọi hàm `commentDelete` để cập nhật trạng thái của bình luận bên ngoài.
        // commentDelete(commentData.id, 'comment');

        // Tắt chế độ xóa và đóng modal.
        console.log('id:', commentData.id);
        // setDeleting(commentData.id, "comment");
        deleteComment();
        // setDeleting();
        setDeleteModalState(false);
    
};

  return (
    <div className="delete-confirmation-wrapper">
      <div className="delete-container">
        <div className="title">Delete comment</div>
        <div className="confirmation-message">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </div>
        <div className="btn-container">
          <button className="cancel-btn" onClick={cancelDelete}>
            No, cancel
          </button>
          <button className="delete-btn" onClick={deleteBtnClick}>
            Yes, delete
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;