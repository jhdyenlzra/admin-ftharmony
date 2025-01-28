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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const POST_CATEGORIES = [
    "Parenting",
    "Safety",
    "Education",
    "Seminars",
    "Family",
    "Organization",
    "Uncategorized",
  ];
  
  // Handle thumbnail upload to Supabase storage
  const handleThumbnailUpload = async (file) => {
    const { data, error } = await supabase.storage
      .from("thumbnails")
      .upload(`public/${Date.now()}-${file.name}`, file);

    if (error) {
      setError("Thumbnail upload failed");
      return null;
    }

    const { publicURL } = supabase.storage.from("thumbnails").getPublicUrl(data.path);
    return publicURL;
  };

  // Handle form submission and post creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser(); // Ensure user is authenticated
    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }

    let thumbnailURL = null;

    // Only upload thumbnail if it's selected
    if (thumbnail) {
      thumbnailURL = await handleThumbnailUpload(thumbnail);
      if (!thumbnailURL) return; // Ensure thumbnail upload was successful
    }

    // Insert the post data into the posts table
    const { error } = await supabase.from("posts").insert([
      {
        title,
        category,
        description,
        thumbnail: thumbnailURL,
        authorID: user.id, // Use authenticated user's ID
      },
    ]);

    if (error) {
      setError("Failed to create post.");
    } else {
      setSuccess(true);
      setTitle("");
      setCategory("Uncategorized");
      setDescription("");
      setThumbnail(null);

      // Redirect to the posts page after successful creation
      navigate("/posts");
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
          <form className="form createPost__form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="form__input"
            />
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form__select"
            >
              {POST_CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <ReactQuill
              className="form__editor"
              modules={modules}
              formats={formats}
              value={description}
              onChange={setDescription}
            />
            <input
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              accept="image/png, image/jpg, image/jpeg"
              className="form__file"
            />
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
