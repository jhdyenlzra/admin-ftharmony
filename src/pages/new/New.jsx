import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  // Handle file upload
  useEffect(() => {
    const uploadFile = async () => {
      if (!file) return;

      const fileName = `${new Date().getTime()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(`public/${fileName}`, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError.message);
        return;
      }

      const { publicURL, error: urlError } = supabase.storage
        .from('images')
        .getPublicUrl(`public/${fileName}`);

      if (urlError) {
        console.error('Error getting public URL:', urlError.message);
        return;
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        image_url: publicURL,
      }));
    };

    uploadFile();
  }, [file]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Sign up the user
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setAuthError(authError.message);
        console.error('Error during sign-up:', authError);
        alert(`Error during sign-up: ${authError.message}`);
        return;
      }

      // Check if user ID is present
      if (!user || !user.id) {
        throw new Error('No user ID returned from sign-up');
      }

      // Step 2: Insert additional user information into the 'users' table
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            user_id: user.id,
            displayName: formData.displayName,
            phone: formData.phone,
            address: formData.address,
            username: formData.username,
            email: formData.email,
            country: formData.country,
            image_url: formData.image_url,
          },
        ]);

      if (dbError) {
        console.error('Error inserting data:', dbError.message);
        alert(`Error inserting data: ${dbError.message}`);
        return;
      }

      console.log("User added successfully with image and authenticated!");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInputChange}
                    value={formData[input.id] || ''}
                  />
                </div>
              ))}

              {authError && <p style={{ color: "red" }}>{authError}</p>}

              <button type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
