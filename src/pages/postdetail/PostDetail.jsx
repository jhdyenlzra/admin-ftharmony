import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostAuthor from "../../components/postauthor/PostAuthor";
import { supabase } from "../../supabaseClient";
import "./postdetail.scss";

const PostDetail = () => {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postID)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
      } else {
        setPost(data);
      }
    };

    fetchPost();
  }, [postID]);

  const handleEdit = () => {
    navigate(`/post/${postID}/edit`, { state: { post } });
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <section className="post-detail">
      <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuthor authorID={post.authorID} />
          <div className="post-detail__buttons">
            <button onClick={handleEdit} className="btn btn-primary">
              Edit
            </button>
            {/* You can implement delete functionality */}
          </div>
        </div>
        <h1 className="post-detail__title">{post.title}</h1>
        <div className="post-detail__thumbnail">
          <img src={post.thumbnail} alt={post.title} />
        </div>
        <div className="post-detail__content">
          <p>{post.description}</p>
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
