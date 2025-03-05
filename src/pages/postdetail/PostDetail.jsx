import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostAuthor from "../../components/postauthor/PostAuthor";
import { supabase } from "../../supabaseClient";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./postdetail.scss";

const PostDetail = () => {
  const { postID } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  const handleBack = useCallback(() => {
    navigate("/posts");
  }, [navigate]);

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

  useEffect(() => {
    fetchPost();

    const subscription = supabase
      .channel(`post_${postID}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts',
          filter: `id=eq.${postID}`
        }, 
        payload => {
          fetchPost();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postID]);

  if (error) {
    return <div className="post-detail__error">{error}</div>;
  }

  if (!post) {
    return <div className="post-detail__loading">Loading...</div>;
  }

  return (
    <section className="post-detail">
      <div className="post-detail__container">
        <PostAuthor authorID={post.authorID} createdAt={post.created_at} />
        <h1 className="post-detail__title">{post.title}</h1>
        {post.thumbnail && (
          <div className="post-detail__thumbnail">
            <img src={post.thumbnail} alt={post.title} />
          </div>
        )}
        <div className="post-detail__content" dangerouslySetInnerHTML={{ __html: post.description }} />
        <button className="back-button" onClick={handleBack}>
          <ArrowBackIcon /> Back to Posts
        </button>
      </div>
    </section>
  );
};

export default PostDetail;
