import React, { useState, useEffect } from 'react';
import authApi from '../../api/authApi';
import jwt_decode from 'jwt-decode';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Box, Button, Container, Grid, Typography, styled, Modal, TextField } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import BlogCard from './BlogCard';
import ReactPaginate from 'react-paginate';
import jwtDecode from 'jwt-decode';
import { event } from 'jquery';

const Blog = () => {
  const [findAllBlog, setFindAllBlog] = useState([]);
  const [user, setUser] = useState('');
  const [blogId, setBlogId] = useState('');
  const [blog, setBlog] = useState([]);
  const [role, setRole] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const AddBlogModalContent = styled(Box)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  });

  const handleAddBlog = () => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveAddBlog = (e) => {
    if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const newBlog = {
      username: jwtDecode(localStorage.getItem('user-access-token')).sub,
      title: formData.get('title'),
      content: formData.get('content'),
      linkThumnail: formData.get('linkThumnail'),
    };

    authApi
      .addBlog(newBlog)
      .then((response) => {
        console.log(response);
        setIsAddModalOpen(false);
        window.location.reload();
      })
      .catch((err) => {
        // Handle errors
        console.error(err);
      });
  };

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

      <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
        <AddBlogModalContent>
          <Typography variant="h6" gutterBottom>
            Add New Blog
          </Typography>
          <form onSubmit={handleSaveAddBlog}>
            <TextField label="Title" required fullWidth name="title" id="title" />
            <TextField label="Content" required fullWidth multiline rows={4} name="content" id="content" />
            <TextField label="Thumbnail Link" required fullWidth name="linkThumnail" id="linkThumnail" />
            <Button type="submit">Save</Button>
            <Button onClick={handleCloseAddModal}>Cancel</Button>
          </form>
        </AddBlogModalContent>
      </Modal>
    </div>
  );
};

export default Blog;
