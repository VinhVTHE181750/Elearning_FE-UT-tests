import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import authApi from '../../../api/authApi';

const Post = ({ courseId }) => {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const [findAllPost, setFindAllPost] = useState([]);

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      const deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }

    authApi
      .findAllPost()
      .then((response) => {
        setFindAllPost(response.data.findAllPost);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleAddPost = (courseId) => {
    const params = {
      username: user,
      courseId: courseId,
      content: content,
    };
    console.log('add parram: ', params);
    authApi
      .addPost(params)
      .then((response) => {
        console.log(response);
        setContent('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeletePost = (courseId) => {
    const params = {
      username: user,
      courseId: courseId,
    };
    console.log('params: ', params);
    authApi
      .deletePost(params)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditPost = (courseId, newContent) => {
    const params = {
      username: user,
      courseId: courseId,
      content: newContent,
    };

    authApi
      .updatePost(params)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <input type="text" value={content} placeholder="Add a comment" onChange={(e) => setContent(e.target.value)} />
      <button onClick={() => handleAddPost(0)}>Add</button>

      <h2>All Posts:</h2>
      <ul>
        {findAllPost.map((post) => (
          <li key={post.courseId}>
            <p>Username: {post.user.username}</p>
            <p>Content: {post.content}</p>
            <button onClick={() => handleEditPost(post.courseId, 'New Content')}>Edit</button>
            <button onClick={() => handleDeletePost(post.courseId)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Post;
