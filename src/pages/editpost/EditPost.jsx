import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./editpost.scss";

const EditPost = () => {
  const location = useLocation();
  const { post } = location.state || {}; // Retrieve passed post data
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

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

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setCategory(post.category);
      setDescription(post.description);
      setThumbnail(post.thumbnail); // Preloading thumbnail
    }
  }, [post]);

  const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            title,
            category,
            description,
            thumbnail
        };
        console.log(newPost);
        alert("Post created successfully!");
    };

  return (
    <div className="editPost">
      <Sidebar />
      <div className="editPost__container">
        <Navbar />
        <div className="editPost__content">
          <h2>Edit Post</h2>
          <form className="form editPost__form" onSubmit={handleSubmit}>
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
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
