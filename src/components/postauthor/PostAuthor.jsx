import React, { useEffect, useState } from "react";
import "./postauthor.scss";
import DefaultAvatar from "../../assets/avatar1.jpg";
import { supabase } from "../../supabaseClient";

const PostAuthor = ({ authorID, createdAt }) => {
  const [authorData, setAuthorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, avatar_url")
          .eq("id", authorID)
          .single();

        if (error) {
          console.error("Error fetching author data:", error);
          setAuthorData({ full_name: "Anonymous", avatar_url: DefaultAvatar });
        } else {
          setAuthorData(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching author data:", err);
        setAuthorData({ full_name: "Anonymous", avatar_url: DefaultAvatar });
      } finally {
        setLoading(false);
      }
    };

    if (authorID) fetchAuthorData();
  }, [authorID]);

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`; // Minutes
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`; // Hours
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`; // Days

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="postAuthor">Loading author details...</div>;
  }

  const fullName = authorData?.full_name || "Anonymous";
  const avatarUrl = authorData?.avatar_url || DefaultAvatar;

  return (
    <div className="postAuthor">
      <div className="postAuthorAvatar">
        <img src={avatarUrl} alt={`Author ${fullName}`} />
      </div>
      <div className="postAuthorDetails">
        <h5>By: {fullName}</h5>
        <small>{formatDate(createdAt)}</small>
      </div>
    </div>
  );
};

export default PostAuthor;
