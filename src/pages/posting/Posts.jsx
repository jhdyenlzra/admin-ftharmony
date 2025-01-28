import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import PostItem from "../../components/postitem/PostItem";
import { supabase } from "../../supabaseClient";
import "./posts.scss";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*");

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []); // Empty array ensures this effect runs only once on mount.

  if (loading) {
    return <div>Loading...</div>;
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
