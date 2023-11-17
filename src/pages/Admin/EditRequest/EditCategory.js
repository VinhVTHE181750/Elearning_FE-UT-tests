import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authApi from '../../../api/authApi';
import './edit.css';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Button } from 'antd';

function EditCategory() {
  const { categoryId } = useParams();
  const [categoryEdit, setCategoryEdit] = useState(null);
  const [category, setCategory] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [nameExistsError, setNameExistsError] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);

  useEffect(() => {
    authApi
      .findAllCategory()
      .then((response) => {
        const categoryArray = (response.data && response.data.categoryList) || [];
        console.log('category: ', categoryArray);
        setCategory(categoryArray);
      })
      .catch((error) => {});
  }, []);
  useEffect(() => {
    if (categoryId)
      authApi
        .getCategoryById({ id: categoryId })
        .then((response) => {
          const category = response.data;
          console.log('category: ', category);
          setCategoryEdit(category);
          setName(category.name);
        })
        .catch((error) => {
          console.log(error);
          setCategoryEdit(null);
        });
  }, [categoryId]);
  if (!categoryEdit) {
    return <div>Category not found</div>;
  }
  const handleCategoryNameChange = (e) => {
    setName(e.target.value);
  };
  const nameRegex = /^[A-Za-zÀ-ỹ0-9!@#$%^&*(),.?":{}|<>':\s]+$/;

  const handleSave = (e) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    if (!nameRegex.test(name.trim())) return window.alert('Error: Name of category invalidate');
    e.preventDefault();
    const params = {
      username: user,
      categoryID: categoryId,
      categoryUpdate: name,
      deleted: false,
    };
    if (name) {
      const checkName = category.find((c) => c.name === name);
      if (checkName) {
        setNameExistsError(true);
      } else {
        authApi
          .updateCategory(params)
          .then((response) => {
            console.log(response);
            setSuccessMessage('Edit success');
          })
          .catch((error) => {
            setErrorMessage('Edit failed');
          });
      }
    } else {
      setErrorMessage('Edit failed');
    }
  };
  const handleBackClick = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    navigate('/manageCategory');
  };
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          <h2>Edit Category</h2>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {nameExistsError && (
            <div className="error-message" style={{ color: 'red' }}>
              If you cannot edit, the name already exists
            </div>
          )}
          <form>
            <div>
              <label>ID:</label>
              <input type="text" value={categoryId} readOnly />
            </div>
            <div>
              <label>Name:</label>
              <input type="text" value={name} onChange={handleCategoryNameChange} />
            </div>
            <div>
              <Button
                type="submit"
                className="button-edit"
                onClick={handleSave}
                style={{ width: '100px', backgroundColor: 'gray', color: 'white' }}
              >
                Save
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
}
export default EditCategory;
