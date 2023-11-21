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
 
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [nameExistsError, setNameExistsError] = useState(false);
  const [inputError, setInputError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
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
  const nameRegex = /^[a-zA-Z0-9]+[A-Za-zÀ-ỹ0-9!@#$%^&*(),.?":{}|<>':\s]+$/;

  const handleSave = (e) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
   
    e.preventDefault();
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
            setInputError('');
            setIsSuccess(true);
            setName(''); // Reset trường nhập liệu sau khi thêm thành công
            navigate('/manageCategory');
          })
          .catch((error) => {
            setInputError('Add Fail Category');
            setIsSuccess(false);
          });
      }
  
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
          {isSuccess && <p className="message success">Update Successfully Category</p>}
          {!isSuccess && inputError && <p className="message error">Update Fail Category</p>}
          
          <form>
            <div>
              <label>ID:</label>
              <input type="text" value={categoryId} readOnly />
            </div>
            <div>
              <label>Name:</label>
              <input type="text" value={name} onChange={handleCategoryNameChange} />
              {inputError &&  <p  style={{ color: 'red' }}>{inputError}</p>}
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
