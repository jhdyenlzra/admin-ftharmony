import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "../../supabaseClient";
import "./editpost.scss";

const EditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {}; // Retrieve passed post data
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
      setDescription(post.description);
      setThumbnail(post.thumbnail); // Preloading thumbnail
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("posts")
        .update({ title, category, description, thumbnail })
        .eq("id", post.id);

      if (error) throw error;

      alert("Post updated successfully!");
      navigate("/posts");
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post. Please try again.");
    }
  };

  return (
    <div className="editPost">
      <Sidebar />
      <div className="editPost__container">
        <Navbar />
        <div className="editPost__content">
          <h2>Edit Post</h2>
          <form className="form editPost__form" onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form__input"
            />
            
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form__select"
            >
              {["Parenting", "Safety", "Education", "Seminars", "Family", "Organization", "Uncategorized"].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <label htmlFor="description">Description</label>
            <ReactQuill
              id="description"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
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
              ]}
              value={description}
              onChange={setDescription}
              className="form__editor"
            />

            <label htmlFor="thumbnail">Thumbnail</label>
            <input
              id="thumbnail"
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              accept="image/png, image/jpg, image/jpeg"
              className="form__file"
            />

            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
