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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { data: user, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("You must be logged in to create a post.");
        setLoading(false);
        return;
      }

      let thumbnailURL = null;
      if (thumbnail) {
        const fileName = `public/${Date.now()}`;
        const { data, error } = await supabase.storage
          .from("thumbnails")
          .upload(fileName, thumbnail);

        if (error || !data) {
          setError("Failed to upload thumbnail. Please try again.");
          setLoading(false);
          return;
        }

        thumbnailURL = `${supabase.storageUrl}/object/public/thumbnails/${data.path}`;
      }

      const postPayload = {
        title,
        category,
        description,
        thumbnail: thumbnailURL,
        authorID: user.user.id,
      };

      const { error: postError } = await supabase.from("posts").insert([postPayload]).single();

      if (postError) {
        setError("Failed to create post. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTitle("");
      setCategory("Uncategorized");
      setDescription("");
      setThumbnail(null);
      navigate("/posts");
    } catch (err) {
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
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;