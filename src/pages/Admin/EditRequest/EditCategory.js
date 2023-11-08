import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dataCategory } from '../../../data/dataCategory';
import authApi from '../../../api/authApi';
import './edit.css';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../../components/Sidebar/Sidebar';

function EditCategory() {
  const { categoryId } = useParams();
  const [categoryEdit, setCategoryEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [name, setName] = useState('');
  const [id, setId] = useState(dataCategory);
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [nameExistsError, setNameExistsError] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }
  }, []);

  useEffect(() => {
    const category = dataCategory.find((category) => category.id === parseInt(categoryId));
    setCategoryEdit(category);
    setId(category.id.toString());
  }, [categoryId]);

  if (!categoryEdit) {
    return <div>Category not found</div>;
  }

  const handleCategoryNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const params = {
      username: user,
      categoryID: id,
      categoryUpdate: name,
      deleted: false,
    };

    if (name) {
      const nameExists = dataCategory.some((category) => category.name === name);
      if (nameExists) {
        setNameExistsError(true);
        return;
      }

      authApi
        .updateCategory(params)
        .then((response) => {
          console.log(response);
          setSuccessMessage('Edit success');
        })
        .catch((error) => {
          setErrorMessage('Edit failed');
        });
    } else {
      setErrorMessage('Edit failed');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="container-edit">
          <h2>Edit Category</h2>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {nameExistsError && <div className="error-message">If you cannot edit, the name already exists</div>}
          <form>
            <div>
              <label>ID:</label>
              <input type="text" value={id} readOnly />
            </div>
            <div>
              <label>Name:</label>
              <input type="text" value={name} onChange={handleCategoryNameChange} />
            </div>
            <button type="submit" className="button-edit" onClick={handleSave}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCategory;
