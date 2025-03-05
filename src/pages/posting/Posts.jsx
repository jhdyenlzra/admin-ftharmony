import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import PostItem from "../../components/postitem/PostItem";
import { supabase } from "../../supabaseClient";
import "./posts.scss";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postID) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      // First, delete any associated files/thumbnails from storage if they exist
      const post = posts.find(p => p.id === postID);
      if (post?.thumbnail) {
        const thumbnailPath = post.thumbnail.split('/').pop(); // Get filename from URL
        await supabase.storage
          .from('thumbnails')
          .remove([thumbnailPath]);
      }

      // Then delete the post from the database
      const { error } = await supabase
        .from('posts')
        .delete()
        .match({ id: postID }); // Make sure we're matching the correct column name

      if (error) {
        throw error;
      }

      // Update local state
      setPosts(posts.filter(post => post.id !== postID));
      alert("Post deleted successfully!");

    } catch (err) {
      console.error("Error deleting post:", err);
      alert(`Failed to delete post: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('posts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts' 
        }, 
        payload => {
          fetchPosts(); // Refresh posts when any changes occur
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show success message if redirected from edit
  useEffect(() => {
    if (location.state?.updateSuccess) {
      alert(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="posts">
      <Sidebar />
      <div className="postsContainer">
        <Navbar />
        {loading ? (
          <div className="loadingMessage">Loading posts...</div>
        ) : error ? (
          <div className="errorMessage">{error}</div>
        ) : posts.length > 0 ? (
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
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        ) : (
          <div className="noPostsMessage">No posts found.</div>
        )}
      </div>
    </div>
  );
};

export default Posts;
