import React from "react";
import "./postauthor.scss";
import Avatar from "../../assets/avatar1.jpg"; // Sample avatar

const PostAuthor = ({ authorID }) => {
  return (
    <div className="postAuthor">
      <div className="postAuthorAvatar">
        <img src={Avatar} alt={`Author ${authorID}`} />
      </div>
      <div className="postAuthorDetails">
        <h5>By: Loryen Lazara</h5>
        <small>Just now</small>
      </div>
    </div>
  );
};

export default PostAuthor;
