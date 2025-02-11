import React from "react";
import { Link } from "react-router-dom";
import "./postitem.scss";
import { PostItemDescription } from "../../helpers/QuillTruncate";


const PostItem = ({ postID, thumbnail, category, title, description }) => (
  <article className="postItem">
    <div className="postItemThumbnail">
      {thumbnail ? (
        <img src={thumbnail} className="thumbnailImage" />
      ) : (
        <div className="noThumbnail">No Thumbnail</div>
      )}
    </div>
    <div className="postItemContent">
      <Link to={`/postdetail/${postID}`} className="postItemTitle">
        <h3>{title}</h3>
      </Link>

      <PostItemDescription description={description} />
      <div className="postItemFooter">
        <span className="postCategory">{category}</span>
      </div>
    </div>
  </article>
);

export default PostItem;
