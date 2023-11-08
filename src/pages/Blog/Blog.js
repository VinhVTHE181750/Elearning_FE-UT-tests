import React, { useState, useEffect } from 'react';
import authApi from '../../api/authApi';
import jwt_decode from 'jwt-decode';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Box, Button, Container, Grid, Typography, styled } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BlogCard from './BlogCard';
import ReactPaginate from 'react-paginate';
import jwtDecode from 'jwt-decode';

const Blog = () => {
  const [findAllBlog, setFindAllBlog] = useState([]);
  const [user, setUser] = useState('');
  const [blogId, setBlogId] = useState('');
  const [blog, setBlog] = useState([]);
  const [role, setRole] = useState('');
  const [newBlog, setNewBlog] = useState({
    username: '',
    title: '',
    content: '',
    linkThumnail: '',
  });

  useEffect(() => {
    if (localStorage.getItem('user-access-token')) {
      const decode = jwtDecode(localStorage.getItem('user-access-token'));
      setRole(decode.userInfo[0]);
    }
  }, [localStorage.getItem('user-access-token')]);

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
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

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

  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 5;

  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = findAllBlog.slice(indexOfFirstPost, indexOfLastPost);

  const pageCount = Math.ceil(findAllBlog.length / postsPerPage);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };

  const BoxTitle = styled(Box)({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  });

  const TextTitle = styled(Typography)({
    padding: '5px 10px',
    width: 'fit-content',
    fontSize: '2rem',
    fontWeight: '600',
    letterSpacing: '3px',
    textTransform: 'capitalize',
    color: 'white',
    background: '#ff6500',
    borderRadius: '5px',
    boxShadow: '2px 3px 2px 2px rgb(0 0 0 / 20%)',
  });

  const ModalButton = styled(Button)({
    margin: '30px',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: 'white',
    height: 'fit-content',
    backgroundColor: '#ff5833',
    '&:hover': {
      backgroundColor: '#ff6500',
    },
  });

  return (
    <div>
      <Header />
      <div style={{ paddingBottom: '150px' }}>
        <Container>
          <Box sx={{ pt: 8 }}>
            <BoxTitle>
              <TextTitle>List Blogs</TextTitle>
              {role === 'ADMIN' && (
                <ModalButton startIcon={<ControlPointIcon />} onClick={() => handleAddBlog()}>
                  Add new blog
                </ModalButton>
              )}
            </BoxTitle>
          </Box>
          <Grid container>
            <Grid item md={12}>
              <Box sx={{ width: '100%', pr: 3 }}>
                {currentPosts.map((blog) => (
                  <BlogCard key={blog.id} blogItem={blog} />
                ))}

                <ReactPaginate
                  previousLabel={'Previous'}
                  nextLabel={'Next'}
                  breakLabel={'...'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>
      <Footer />
    </div>
  );

  // return (
  //   <div>
  //     <Header />
  //     <h1>Blog List</h1>
  //     <div style={{ margin: '20px' }}>
  //       <List
  //         grid={{
  //           gutter: 16,
  //           column: 4,
  //         }}
  //         dataSource={findAllBlog}
  //         renderItem={(item) => (
  //           <List.Item>
  //             <Card title={item.title}>{item.content}</Card>
  //           </List.Item>
  //         )}
  //       />
  //     </div>
  //     {/* {findAllBlog.map((blog) => (
  //       <div key={blog.id}>
  //         <h2>{blog.title}</h2>
  //         <p>{blog.content}</p>
  //         <p>{blog.linkThumnail}</p>

  //         <button onClick={() => handleDeleteBlog(blog.id)}>DELETE</button>
  //         <button onClick={() => handleEditBlog(blog.id)}>EDIT</button>
  //       </div>
  //     ))}

  //     <h2>Thêm Blog mới</h2>
  //     <input type="text" name="username" value={user} onChange={handleInputChange} placeholder="Username" />
  //     <br />
  //     <input type="text" name="title" value={newBlog.title} onChange={handleInputChange} placeholder="Title" />
  //     <br />
  //     <input type="text" name="content" value={newBlog.content} onChange={handleInputChange} placeholder="Content" />
  //     <br />
  //     <input
  //       type="text"
  //       name="linkThumnail"
  //       value={newBlog.linkThumnail}
  //       onChange={handleInputChange}
  //       placeholder="Link Thumnail"
  //     />
  //     <br />
  //     <button onClick={handleAddBlog}>ADD</button> */}
  //     <Footer />
  //   </div>
  // );
};

export default Blog;
