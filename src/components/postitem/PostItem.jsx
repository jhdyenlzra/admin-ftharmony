import React from "react";
import { Link } from "react-router-dom";
import "./postitem.scss";
import { PostItemDescription } from "../../helpers/QuillTruncate";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const PostItem = ({ postID, thumbnail, category, title, description, onDelete }) => (
  <article className="postItem">
    <div className="postItemThumbnail">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={`Thumbnail for ${title}`}
          className="thumbnailImage"
        />
      ) : (
        <div className="noThumbnail">No Thumbnail</div>
      )}
    </div>
    <div className="postItemContent">
      <div className="postItemHeader">
        <Link to={`/postdetail/${postID}`} className="postItemTitle">
          <h3>{title}</h3>
        </Link>
        <button 
          className="deletePostButton"
          onClick={() => onDelete(postID)}
          title="Delete post"
        >
          <DeleteOutlineIcon />
        </button>
      </div>

      <PostItemDescription description={description} />
      <div className="postItemFooter">
        <span className="postCategory">{category}</span>
      </div>
    </div>
  </article>
);

export default PostItem;
