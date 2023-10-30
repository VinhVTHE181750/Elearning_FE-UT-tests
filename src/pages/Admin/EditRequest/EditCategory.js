import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dataCategory } from '../../../data/dataCategory';
import authApi from '../../../api/authApi';
import './edit.css';

function EditCategory() {
  const { categoryId } = useParams();
  const [categoryEdit, setCategoryEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [name, setName] = useState('');
  const [id, setId] = useState(dataCategory);
  const navigate = useNavigate();

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
      categoryID: id,
      categoryUpdate: name,
    };

    if (name) {
      authApi
        .updateCategory(params)
        .then((response) => {
          console.log(response);
          setSuccessMessage('Edit thành công');
        })
        .catch((error) => {
          setErrorMessage('Edit thất bại');
        });
    } else {
      setErrorMessage('Edit thất bại');
    }
  };

  return (
    <div className="container-edit">
      <h2>Edit Category</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
  );
}

export default EditCategory;
