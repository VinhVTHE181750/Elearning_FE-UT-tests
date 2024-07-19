import React, { useContext, useRef, useState } from 'react';
import { Box, Button, Card, Grid, Typography, Modal, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment/moment';
import jwtDecode from 'jwt-decode';
import authApi from '../../api/authApi';

const BoxTime = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  color: '#5e5f5f',
  fontSize: '0.875rem',
});

function BlogCard({ blogItem }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const editedTitleRef = useRef(blogItem.title);
  const editedContentRef = useRef(blogItem.content);
  const editedLinkThumnailRef = useRef(blogItem.linkThumnail);

  const handleEditBlog = () => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = () => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');

    const editData = {
      username: jwtDecode(localStorage.getItem('user-access-token')).sub,
      blogId: blogItem.id,
      title: editedTitleRef.current.value, // Lấy giá trị từ useRef bằng cách sử dụng .value
      content: editedContentRef.current.value, // Lấy giá trị từ useRef bằng cách sử dụng .value
      linkThumnail: editedLinkThumnailRef.current.value, // Lấy giá trị từ useRef bằng cách sử dụng .value
    };
    authApi
      .updateBlog(editData)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {});
    window.location.reload();
  };

  const handleDeleteBlog = () => {
    // if (!localStorage.getItem('user-access-token')) return (window.location.href = '/signin');
    if (window.confirm(`Delete blog: ${blogItem.title}`)) {
      const deleteData = {
        username: jwtDecode(localStorage.getItem('user-access-token')).sub,
        blogId: blogItem.id,
      };
      authApi
        .deleteBlog(deleteData)
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const CardBox = styled(Card)({
    padding: '2rem',
    marginBottom: '3rem',
    borderRadius: '20px',
    boxShadow:
      '3px 4px 2px -2px rgb(255 101 0 / 20%), 3px 2px 2px 3px rgb(255 101 0 / 14%), 3px 2px 4px 1px rgb(255 101 0 / 12%)',
  });

  const Title = styled(Typography)({
    lineHeight: 1.2,
    fontSize: '1.4rem',
    fontWeight: '600',
    marginBottom: '15px',

    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: '#ff6500',
      textUnderlineOffset: '3px',
      textDecorationThickness: '2px',
    },
  });

  const Paragraph = styled(Typography)({
    marginBottom: '0.5rem',
    lineHeight: 1.8,
    height: 'auto',
    textAlign: 'justify',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
  });

  return (
    <CardBox>
      <Grid container columnSpacing={3} rowSpacing={3}>
        <Grid item md={3}>
          <div className="card-image">
            <img
              className="img-hover"
              src={
                'https://png.pngtree.com/png-vector/20230304/ourmid/pngtree-colorful-blog-speech-bubble-vector-png-image_6633021.png'
              }
            />
            {/* <img className="img-hover" src={blogItem.linkThumnail} /> */}
          </div>
        </Grid>
        <Grid item md={7}>
          <Box>
            <Title style={{ textDecoration: 'none' }}>{blogItem.title}</Title>
            <Paragraph>{blogItem.content}</Paragraph>
            <BoxTime>
              <CalendarMonthIcon fontSize="small" /> {moment(blogItem.createdAt).format('MMMM Do YYYY, h:mm a')}
            </BoxTime>
          </Box>
          {localStorage.getItem('user-access-token') &&
            jwtDecode(localStorage.getItem('user-access-token')).userInfo[0] === 'ADMIN' && (
              <>
                <Box xs={4}>
                  <Button onClick={() => handleEditBlog()}>Edit</Button>
                  <Button onClick={() => handleDeleteBlog()}>Delete</Button>
                </Box>
              </>
            )}

          <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
            <Card>
              <Box p={2}>
                <Typography variant="h6" gutterBottom>
                  Edit Blog
                </Typography>
                <TextField
                  label="Title"
                  fullWidth
                  defaultValue={blogItem.title}
                  inputRef={(ref) => (editedTitleRef.current = ref)} // Sử dụng inputRef để gán giá trị vào useRef
                />
                <TextField
                  label="Content"
                  fullWidth
                  multiline
                  rows={4}
                  defaultValue={blogItem.content}
                  inputRef={(ref) => (editedContentRef.current = ref)} // Sử dụng inputRef để gán giá trị vào useRef
                />
                <TextField
                  label="Thumbnail Link"
                  fullWidth
                  defaultValue={blogItem.linkThumnail}
                  inputRef={(ref) => (editedLinkThumnailRef.current = ref)} // Sử dụng inputRef để gán giá trị vào useRef
                />
                <Button onClick={handleSaveEdit}>Save</Button>
              </Box>
            </Card>
          </Modal>
        </Grid>
      </Grid>
    </CardBox>
  );
}

export default BlogCard;
