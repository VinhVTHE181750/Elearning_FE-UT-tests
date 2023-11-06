import { useEffect, useState } from "react";

import "./Styles/Comment.scss";

import AddComment from "./AddComment";
import ReplyContainer from "./ReplyContainer";
import DeleteModal from "./DeleteModal";
import CommentVotes from "./CommentVotes";
import CommentHeader from "./CommentHeader";
import CommentFooter from "./CommentFooter";
import { useParams } from 'react-router-dom';
import { commentPostedTime } from "../utils";
import authApi from '../../../api/authApi';
const Comment = ({
  commentData,
  updateScore,
  updateReplies,
  editComment,
  commentDelete,
  setDeleteModalState,
}) => {

  const [replying, setReplying] = useState(false);
  const [time, setTime] = useState("");
  const [vote, setVoted] = useState(false);
  const [score, setScore] = useState(commentData.score);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(commentData.content);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  // get time from comment posted
  const createdAt = new Date(commentData.createdAt);
  const today = new Date();
  const differenceInTime = today.getTime() - createdAt.getTime();

  useEffect(() => {
    setTime(commentPostedTime(differenceInTime));
    localStorage.setItem("voteState", vote);
  }, [differenceInTime, vote]);

  const addReply = (newReply) => {
    const replies = [...commentData.replies, newReply];
    updateReplies(replies, commentData.id);
    setReplying(false);
  };



  const updateComment = () => {
    if (content === '') {
      setErrorMessage('Content is required.');
      return;
    }

    const params = {
      email: 'hoanghiep310102@gmail.com',
      content,
      lessonID: 1,
    };
    authApi
      .updateComments(params)
      .then((response) => {
        setSuccessMessage('Post updated successfully.');
        setErrorMessage(null);
      })
      .catch((error) => {
        setErrorMessage('Error updating post.');
        setSuccessMessage(null);
        console.error('Error updating post:', error);
      });


    editComment(content, commentData.id, "comment");
    setEditing(false);
  };

  const deleteComment = (id, type) => {
    const finalType = type !== undefined ? type : "comment";
    const finalId = id !== undefined ? id : commentData.id;
    commentDelete(finalId, finalType, commentData.id);
    setDeleting(false);
  };

  return (
    <div
      className={`comment-container ${commentData.replies && commentData.replies.length > 0 ? "reply-container-gap" : ""}`}
    >
      <div className="comment">
        <CommentVotes
          vote={vote}
          setVoted={setVoted}
          score={score}
          setScore={setScore}
          updateScore={updateScore}
          commentData={commentData}
        />
        <div className="comment--body">
          <CommentHeader
            commentData={commentData}
            setReplying={setReplying}
            setDeleting={setDeleting}
            setDeleteModalState={setDeleteModalState}
            setEditing={setEditing}
            time={time}
          />
          {!editing ? (
            <div className="comment-content">{commentData.content}</div>
          ) : (
            <textarea
              className="content-edit-box"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          )}
          {editing && (
            <button className="update-btn" onClick={updateComment}>
              update
            </button>

          )}
          {/* Apply button class */}
          {successMessage && <div className="success-message">{successMessage}</div>} {/* Apply success-message class */}
          {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Apply error-message class */}
          
        </div>
        <CommentFooter
          vote={vote}
          setVoted={setVoted}
          score={score}
          setScore={setScore}
          updateScore={updateScore}
          commentData={commentData}
          setReplying={setReplying}
          setDeleting={setDeleting}
          setDeleteModalState={setDeleteModalState}
          setEditing={setEditing}
        />{" "}
      </div>

      {replying && (
        <AddComment
          buttonValue={"reply"}
          addComments={addReply}
          replyingTo={commentData.username}
        />
      )}


      {deleting && (
        <DeleteModal
          setDeleting={setDeleting}
          deleteComment={deleteComment}
          commentData={commentData} // Truyền commentData vào DeleteModal
          setDeleteModalState={setDeleteModalState}
        />
      )}

    </div>

  );
};

export default Comment;



