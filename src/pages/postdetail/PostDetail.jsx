import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostAuthor from "../../components/postauthor/PostAuthor";
import { supabase } from "../../supabaseClient";
import "./postdetail.scss";

const PostDetail = () => {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postID)
          .single();

        if (error) {
          setError("Failed to fetch post. Please try again later.");
        } else {
          setPost(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching post:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchPost();
  }, [postID]);

  const handleEdit = () => {
    navigate(`/post/${postID}/edit`, { state: { post } });
  };

  if (error) {
    return <div className="post-detail__error">{error}</div>;
  }

  if (!post) {
    return <div className="post-detail__loading">Loading...</div>;
  }

  return (
    <section className="post-detail">
      <div className="post-detail__container">
        <div className="post-detail__header">
          <PostAuthor authorID={post.authorID} />
          <div className="post-detail__actions">
            <button onClick={handleEdit} className="btn btn-primary">
              Edit
            </button>
            {/* Add delete functionality if needed */}
          </div>
        </div>
        <h1 className="post-detail__title">{post.title}</h1>
        {post.thumbnail && (
          <div className="post-detail__thumbnail">
            <img src={post.thumbnail} alt={post.title} />
          </div>
        )}
        <div className="post-detail__content">
          <p>{post.description}</p>
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
