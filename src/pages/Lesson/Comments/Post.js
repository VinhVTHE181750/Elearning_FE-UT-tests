import React, { useState, useEffect } from "react";
import './Styles/App.scss';
import './Styles/Comment.scss';
import Comment from "./Comment";
import AddComment from "./AddComment";
import authApi from '../../../api/authApi';

const Post = () => {
  const [comments, setComments] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState(false);

  useEffect(() => {
    authApi
      .findAllComments()
      .then((response) => {
        console.log('data: ', response.data);
        const commentsArray = (response.data && response.data.findAllPost) || [];
        setComments(commentsArray);
        console.log('Comments state after update:', commentsArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
    deleteModalState
      ? document.body.classList.add("overflow--hidden")
      : document.body.classList.remove("overflow--hidden");
  }, [comments, deleteModalState]);

  const updateScore = (score, id, type) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === id) {
          if (type === "comment") {
            return { ...comment, score: score };
          } else if (type === "reply") {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === id) {
                return { ...reply, score: score };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
        }
        return comment;
      });
    });
  };

  const addComments = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  const updateReplies = (replies, id) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === id) {
          return { ...comment, replies: [...replies] };
        }
        return comment;
      });
    });
  };

  const editComment = (content, id, type) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === id) {
          if (type === "comment") {
            return { ...comment, content: content };
          } else if (type === "reply") {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === id) {
                return { ...reply, content: content };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
        }
        return comment;
      });
    });
  };

  const commentDelete = (id, type, parentComment) => {
    setComments(prevComments => {
      if (type === "comment") {
        return prevComments.filter(data => data.id !== id);
      } else if (type === "reply") {
        return prevComments.map(comment => {
          if (comment.id === parentComment) {
            const updatedReplies = comment.replies.filter(data => data.id !== id);
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        });
      }
      return prevComments;
    });
  };

  return (
    <main className="App">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          commentData={comment}
          updateScore={updateScore}
          updateReplies={updateReplies}
          editComment={editComment}
          commentDelete={commentDelete}
          setDeleteModalState={setDeleteModalState}
        />
      ))}
      <AddComment buttonValue={"send"} addComments={addComments} />
    </main>
  );
};

export default Post;
