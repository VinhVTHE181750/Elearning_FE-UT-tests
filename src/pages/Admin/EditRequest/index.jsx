import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dataUser } from '../../../data/dataUser';
import './edit.css';
import Sidebar from '../../../components/Sidebar/Sidebar';
function EditUser() {
  const { userId } = useParams();
  const [userToEdit, setUserToEdit] = useState(null);
  const negative = useNavigate();
  // Tìm thông tin user cần chỉnh sửa dựa trên userId
  useEffect(() => {
    const user = dataUser.find((user) => user.id === parseInt(userId));
    setUserToEdit(user);
  }, [userId]);

  if (!userToEdit) {
    return <div>User not found</div>;
  }

  // Hàm xử lý sự kiện khi người dùng thay đổi giá trị của các trường nhập liệu
  const handleFullNameChange = (e) => {
    setUserToEdit({ ...userToEdit, fullName: e.target.value });
  };

  const handleUsernameChange = (e) => {
    setUserToEdit({ ...userToEdit, username: e.target.value });
  };

  const handleEmailChange = (e) => {
    setUserToEdit({ ...userToEdit, email: e.target.value });
  };

  const handleGenderChange = (e) => {
    setUserToEdit({ ...userToEdit, gender: e.target.value });
  };

  const handlePhoneChange = (e) => {
    setUserToEdit({ ...userToEdit, phone: e.target.value });
  };

  const handleDobChange = (e) => {
    setUserToEdit({ ...userToEdit, dob: e.target.value });
  };

  const handleStatusChange = (e) => {
    setUserToEdit({ ...userToEdit, status: e.target.value });
  };

  const handleSave = (e) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    e.preventDefault();
    negative('/team');
  };
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          <h2>Edit User</h2>
          <form>
            <div>
              <label>Full Name:</label>
              <input type="text" value={userToEdit.fullName} onChange={handleFullNameChange} />
            </div>
            <div>
              <label>Username:</label>
              <input type="text" value={userToEdit.username} onChange={handleUsernameChange} />
            </div>
            <div>
              <label>Email:</label>
              <input type="text" value={userToEdit.email} onChange={handleEmailChange} />
            </div>
            <div>
              <label>Gender:</label>
              <input type="text" value={userToEdit.gender} onChange={handleGenderChange} />
            </div>
            <div>
              <label>Phone:</label>
              <input type="text" value={userToEdit.phone} onChange={handlePhoneChange} />
            </div>
            <div>
              <label>DOB:</label>
              <input type="text" value={userToEdit.dob} onChange={handleDobChange} />
            </div>
            <div>
              <label>Status:</label>
              <input type="text" value={userToEdit.status} onChange={handleStatusChange} />
            </div>
            {/* Thêm các trường thông tin khác của user */}
            <button type="submit" className="button-edit" onClick={handleSave}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
