import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import authApi from '../../../api/authApi';
import { Button, Input, List, Skeleton } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment/moment';

const Posts = ({ courseId, courseName }) => {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const [listPost, setListPost] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [addContent, setAddContent] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      const deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }

    authApi
      .getPostByCourseId(courseId)
      .then((response) => {
        const sortedPosts = response.data.postList.sort(
          (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf(),
        );
        setListPost(sortedPosts);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (user) {
      authApi
        .getPaymentUser(user)
        .then((response) => {
          const paymentArray = (response.data && response.data.listPayment) || [];
          setPayments(paymentArray);
        })
        .catch((error) => {
          console.error('Error fetching payments by username:', error);
        });
    }
  }, [user]);

  const handleAddPost = () => {
    const params = {
      username: user,
      courseId: courseId,
      content: addContent,
    };
    authApi
      .addPost(params)
      .then((response) => {
        console.log(response);
        setContent('');
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeletePost = (postId) => {
    const params = {
      username: user,
      courseId: courseId,
      postId,
    };
    authApi
      .deletePost(params)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditPost = (postId, postContent) => {
    setEditMode(postId);
    setEditedContent(postContent);
  };

  const handleSaveEdit = (postId) => {
    const params = {
      username: user,
      courseId: courseId,
      postId,
      content: editedContent,
    };

    authApi
      .updatePost(params)
      .then((response) => {
        console.log(response);
        setEditMode(null);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  return (
    <div style={{ margin: '20px' }}>
      <div style={!payments.find((course) => course.courseName === courseName) && { display: 'none' }}>
        <div style={{ borderBottom: '1px solid blue' }}>
          <List.Item.Meta
            title={<a>Me</a>}
            description={
              <div>
                <TextArea
                  style={{ width: '900px', height: '60px' }}
                  value={addContent}
                  placeholder="Add a comment"
                  onChange={(e) => setAddContent(e.target.value)}
                />
                <br />
                <div>
                  <Button key="list-loadmore-save" type="primary" onClick={() => handleAddPost()}>
                    Comment
                  </Button>
                </div>
              </div>
            }
          />
        </div>
      </div>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={listPost}
        pagination={true}
        renderItem={(item) => (
          <List.Item
            actions={
              item.user.username === user
                ? editMode === item.id
                  ? [<div></div>]
                  : [
                      <a
                        style={{ color: 'blue' }}
                        key="list-loadmore-edit"
                        onClick={() => handleEditPost(item.id, item.content)}
                      >
                        Edit
                      </a>,
                      <a style={{ color: 'red' }} key="list-loadmore-more" onClick={() => handleDeletePost(item.id)}>
                        Delete
                      </a>,
                    ]
                : []
            }
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                title={
                  <div>
                    <div>
                      <a>{item.user.username === user ? `${item.user.username + '(Me)'}` : item.user.username}</a>
                    </div>
                    <div>
                      <a>Create: {moment(item.createdAt).format('MMMM Do YYYY, h:mm a')}</a>
                    </div>
                  </div>
                }
                description={
                  editMode === item.id ? (
                    <div>
                      <TextArea
                        style={{ width: '900px', height: '60px' }}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      />
                      <br />
                      <div>
                        <Button key="list-loadmore-save" type="primary" onClick={() => handleCancel(item.id)}>
                          Cancel
                        </Button>{' '}
                        <Button key="list-loadmore-save" type="primary" onClick={() => handleSaveEdit(item.id)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <a style={{ fontSize: '15px', fontWeight: 'bold' }}>{item.content}</a>
                  )
                }
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Posts;
