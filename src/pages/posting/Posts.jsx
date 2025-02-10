import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import PostItem from "../../components/postitem/PostItem";
import { supabase } from "../../supabaseClient";
import "./posts.scss";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select("*");

        if (error) {
          throw error;
        }

        setPosts(data || []);
      } catch (error) {
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="posts">
        <Sidebar />
        <div className="postsContainer">
          <Navbar />
          <div className="loadingMessage">Loading posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts">
        <Sidebar />
        <div className="postsContainer">
          <Navbar />
          <div className="errorMessage">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="posts">
      <Sidebar />
      <div className="postsContainer">
        <Navbar />
        {posts.length > 0 ? (
          <div className="postsContent">
            {posts.map((post) => (
              <PostItem
                key={post.id}
                postID={post.id}
                thumbnail={post.thumbnail}
                category={post.category}
                title={post.title}
                description={post.description}
                authorID={post.authorID}
              />
            ))}
          </div>
        ) : (
          <h2 className="noPostsMessage">No posts found</h2>
        )}
      </div>
    </div>
  );
};

export default Posts;
