import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import authApi from '../../../api/authApi';

const Post = ({ courseId }) => {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const [listPost, setListPost] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user-access-token');
    if (userString) {
      const deCoded = jwt_decode(userString);
      setUser(deCoded.sub);
    }

    authApi
      .getPostByCourseId(courseId)
      .then((response) => {
        setListPost(response.data.postList);
      })
      .catch((err) => {});
  }, []);

  const handleAddPost = () => {
    const params = {
      username: user,
      courseId: courseId,
      content: content,
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

  const handleDeletePost = () => {
    const params = {
      username: user,
      courseId: courseId,
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

  const handleEditPost = (newContent) => {
    const params = {
      username: user,
      courseId: courseId,
      content: newContent,
    };

    authApi
      .updatePost(params)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <input type="text" value={content} placeholder="Add a comment" onChange={(e) => setContent(e.target.value)} />
      <button onClick={() => handleAddPost()}>Add</button>

      <h2>List comment:</h2>
      <ul>
        {Array.isArray(listPost) ? (
          listPost.map((post) => (
            <li key={post.courseId}>
              <p>Username: {post.user.username}</p>
              {post.user.username === user ? (
                <input type="text" value={post.content}></input>
              ) : (
                <p>Content: {post.content}</p>
              )}
              <p>Content: {post.content}</p>
              <button onClick={() => handleEditPost('New Content')}>Edit</button>
              <button onClick={() => handleDeletePost()}>Delete</button>
            </li>
          ))
        ) : (
          <p>listPost is not an array</p>
        )}
      </ul>
    </div>
  );
};

export default Post;
