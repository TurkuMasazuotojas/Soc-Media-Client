import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function Post() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext)

  useEffect(() => {
    axios.get(`https://soc-media-project.herokuapp.com/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`https://soc-media-project.herokuapp.com/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        "https://soc-media-project.herokuapp.com/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = { commentBody: newComment, username: response.data.username };
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };
  const deleteComment = (id) => {
    axios
      .delete(`https://soc-media-project.herokuapp.com/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(comments.filter((val) => val.id !== id));
      })
      .catch((error) => {
       console.log(error);
      });
  };
  const deletePost = (id) => {
    axios
      .delete(`https://soc-media-project.herokuapp.com/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title"> {postObject.title} </div>
          <div className="body">{postObject.postText}</div>
          <div className="footer">{postObject.username}
          {authState.username === postObject.username && (
              <DeleteForeverIcon onClick={() => {deletePost(postObject.id);}}/>)}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}/>
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label> Username: {comment.username}</label>
                {authState.username === comment.username && (
                  <button onClick={() => {deleteComment(comment.id)}}>X</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
