import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./createpost.scss";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();


  console.log(description)


  const POST_CATEGORIES = [
    "Parenting",
    "Safety",
    "Education",
    "Seminars",
    "Family",
    "Organization",
    "Uncategorized",
  ];

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const handleThumbnailUpload = async (file) => {
  try {
    const fileName = `public/${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("thumbnails") // Ensure the bucket name is correct
      .upload(fileName, file);

    console.log("Upload response:", data);

    if (error || !data) {
      console.error("Thumbnail upload error:", error);
      setError("Failed to upload thumbnail. Please try again.");
      return null;
    }

    const filePath = data.path; // Use the returned file path
    console.log("File path used for public URL:", filePath);

    // Generate the public URL
    const publicUrl = `${supabase.storageUrl}/object/public/thumbnails/${filePath}`;
    console.log("Generated public URL:", publicUrl);

    if (!publicUrl) {
      console.error("Failed to retrieve public URL for thumbnail.");
      setError("Failed to generate thumbnail URL.");
      return null;
    }

    return publicUrl;
  } catch (err) {
    console.error("Unexpected error during thumbnail upload:", err);
    setError("An unexpected error occurred during thumbnail upload.");
    return null;
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { data: user, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Authentication error:", authError);
        setError("You must be logged in to create a post.");
        setLoading(false);
        return;
      }

      let thumbnailURL = null;
      if (thumbnail) {
        thumbnailURL = await handleThumbnailUpload(thumbnail);
        if (!thumbnailURL) {
          setLoading(false);
          return;
        }
      }

      // Construct the post payload
      const postPayload = {
        title,
        category,
        description,
        thumbnail: thumbnailURL,
        authorID: user.user.id,
      };

      // Log the post payload
      console.log("Post payload:", postPayload);

      const { data, error: postError } = await supabase.from("posts").insert([postPayload]).single();

      if (postError) {
        console.error("Post creation error:", postError);
        setError("Failed to create post. Please try again.");
        return;
      }

      console.log("Post created successfully:", data);
      setSuccess(true);

      // Reset form
      setTitle("");
      setCategory("Uncategorized");
      setDescription("");
      setThumbnail(null);

      // Navigate to posts page
      navigate("/posts");
    } catch (err) {
      console.error("Unexpected error during post creation:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createPost">
      <Sidebar />
      <div className="createPost__container">
        <Navbar />
        <div className="createPost__content">
          <h2>Create Post</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Post created successfully!</div>}
          <form onSubmit={handleSubmit} className="createPost__form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {POST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <ReactQuill
                id="description"
                type="text"
                placeholder="Enter post description"
                value={description}
                onChange={setDescription}
                modules={modules}
              />
            </div>
            <div className="form-group">
              <label htmlFor="thumbnail">Thumbnail</label>
              <input
                id="thumbnail"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setThumbnail(e.target.files[0])}
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
