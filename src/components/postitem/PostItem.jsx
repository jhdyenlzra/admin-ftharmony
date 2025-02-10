import React from "react";
import { Link } from "react-router-dom";
import "./postitem.scss";

const PostItem = ({ postID, thumbnail, category, title, description }) => (
  <article className="postItem">
    <div className="postItemThumbnail">
      {thumbnail ? (
        <img src={thumbnail} alt={`Thumbnail for ${title}`} className="thumbnailImage" />
      ) : (
        <div className="noThumbnail">No Thumbnail</div>
      )}
    </div>
    <div className="postItemContent">
      <Link to={`/postdetail/${postID}`} className="postItemTitle">
        <h3>{title}</h3>
      </Link>
      <p className="postItemDescription">
        {description.length > 100
          ? `${description.substring(0, 100)}...`
          : description}
      </p>
      <div className="postItemFooter">
        <span className="postCategory">{category}</span>
      </div>
    </div>
  </article>
);

export default PostItem;
