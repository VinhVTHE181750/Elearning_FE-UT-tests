import React, { useState, useEffect } from 'react';
import authApi from '../../api/authApi';
import jwt_decode from 'jwt-decode';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const Blog = () => {
  const [findAllBlog, setFindAllBlog] = useState([]);
  const [user, setUser] = useState('');
  const [blogId, setBlogId] = useState('');
  const [blog, setBlog] = useState([]);
  const [newBlog, setNewBlog] = useState({
    username: '',
    title: '',
    content: '',
    linkThumnail: '',
  });

  useEffect(() => {
    authApi
      .findAllBlog()
      .then((response) => {
        setFindAllBlog(response.data.blogList);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    authApi
      .getBlogById(blogId)
      .then((response) => {
        setBlog(response.data.blog);
      })
      .catch((err) => {});
  }, [blogId]);

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      var deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
      setNewBlog((prevState) => ({
        ...prevState,
        username: deCoded.sub,
      }));
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBlog((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddBlog = () => {
    authApi
      .addBlog(newBlog)
      .then((response) => {
        // Xử lý phản hồi từ API (nếu cần)
        console.log(response);
        window.location.reload();
      })
      .catch((err) => {});
  };

  const handleDeleteBlog = (blogId) => {
    const deleteData = {
      username: user,
      blogId: blogId,
    };

    authApi
      .deleteBlog(deleteData)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((err) => {});
  };

  const handleEditBlog = (blogId) => {
    setBlogId(blogId);
    const editData = {
      username: user,
      blogId: blogId,
      title: blog.title,
      content: blog.content,
      linkThumnail: blog.linkThumnail,
    };
    console.log('Edit data: ', editData);
    authApi
      .updateBlog(editData)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {});
  };

  return (
    <div>
      <Header />
      <h1>Danh sách Blog</h1>
      {findAllBlog.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
          <p>{blog.linkThumnail}</p>

          <button onClick={() => handleDeleteBlog(blog.id)}>DELETE</button>
          <button onClick={() => handleEditBlog(blog.id)}>EDIT</button>
        </div>
      ))}

      <h2>Thêm Blog mới</h2>
      <input type="text" name="username" value={user} onChange={handleInputChange} placeholder="Username" />
      <br />
      <input type="text" name="title" value={newBlog.title} onChange={handleInputChange} placeholder="Title" />
      <br />
      <input type="text" name="content" value={newBlog.content} onChange={handleInputChange} placeholder="Content" />
      <br />
      <input
        type="text"
        name="linkThumnail"
        value={newBlog.linkThumnail}
        onChange={handleInputChange}
        placeholder="Link Thumnail"
      />
      <br />
      <button onClick={handleAddBlog}>ADD</button>
      <Footer />
    </div>
  );
};

export default Blog;
