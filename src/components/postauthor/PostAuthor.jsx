import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./postauthor.scss";
import DefaultAvatar from "../../assets/avatar1.jpg"; // Default avatar

const PostAuthor = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();

        if (error) {
          throw new Error("Error fetching user.");
        }

        setUser(userData);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) return <p className="loading">Loading author details...</p>;
  if (error) return <p className="error">Failed to load author: {error}</p>;

  const fullName = user?.user_metadata?.full_name || user?.email || "Anonymous";
  const avatarUrl = user?.user_metadata?.avatar_url || DefaultAvatar;

  return (
    <div className="postAuthor">
      <div className="postAuthorAvatar">
        <img src={avatarUrl} alt={`Author ${fullName}`} />
      </div>
      <div className="postAuthorDetails">
        <h5>By: {fullName}</h5>
        <small>Just now</small>
      </div>
    </div>
  );
};

export default PostAuthor;
