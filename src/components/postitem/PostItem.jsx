import React from "react";
import { Link } from "react-router-dom";
import "./postitem.scss";

const PostItem = ({ postID, thumbnail, category, title, description }) => (
  <article className="postItem">
    <div className="postItemThumbnail">
      <img src={thumbnail} alt={title} />
    </div>
    <div className="postItemContent">
      <Link to={`/postdetail/${postID}`} className="postItemTitle">
        <h3>{title}</h3>
      </Link>
      <p>{description.length > 100 ? `${description.substr(0, 100)}...` : description}</p>
      <div className="postItemFooter">{category}</div>
    </div>
  </article>
);

export default PostItem;
