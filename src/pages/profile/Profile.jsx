import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { supabase } from "../../supabaseClient";
import avatar from "../../assets/avatar.jpg"; // Default avatar path
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import "./profile.scss";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    avatarUrl: avatar,
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch profile details
  const fetchProfile = async () => {
    try {
      const user = supabase.auth.user();
      if (!user) {
        setError("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name, email, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      setProfile({
        fullName: data.full_name,
        email: data.email,
        avatarUrl: data.avatar_url || avatar,
      });
    } catch (err) {
      setError("Error fetching profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle avatar file change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(fileName, file);

        if (error) {
          setError("Failed to upload avatar");
          return;
        }

        const { publicURL } = supabase.storage.from("avatars").getPublicUrl(data.path);
        setProfile((prev) => ({ ...prev, avatarUrl: publicURL }));
        setIsEditingAvatar(true);
      } catch (err) {
        setError("Unexpected error occurred while uploading avatar");
      }
    }
  };

  const toggleEditAvatar = () => {
    setIsEditingAvatar(false);
  };

  // Handle profile form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const user = supabase.auth.user();
      if (!user) {
        setError("User not authenticated");
        return;
      }

      const updates = {
        full_name: profile.fullName,
        email: profile.email,
        avatar_url: profile.avatarUrl,
      };

      const { error } = await supabase.from("users").update(updates).eq("id", user.id);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Unexpected error occurred while updating profile");
    }
  };

  return (
    <div className="profile">
      <Sidebar />
      <div className="profileContainer">
        <Navbar />
        <div className="profileContent">
          {/* Avatar Section */}
          <div className="avatarSection">
            <div className="avatar__wrapper">
              <img className="profile__avatar" src={profile.avatarUrl} alt="User Avatar" />
              <div className="editButtonWrapper">
                {!isEditingAvatar ? (
                  <>
                    <label htmlFor="avatarInput">
                      <EditIcon className="iconButton" />
                    </label>
                    <input
                      id="avatarInput"
                      type="file"
                      onChange={handleAvatarChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </>
                ) : (
                  <CheckIcon className="iconButton" onClick={toggleEditAvatar} />
                )}
              </div>
            </div>
            <h1 className="userName">{profile.fullName}</h1>
          </div>

          {/* User Information Section */}
          <div className="userInfoSection">
            <h2>User Information</h2>
            <form className="profile__form" onSubmit={handleFormSubmit}>
              {/* Name Field */}
              <input
                type="text"
                placeholder="Full Name"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />

              {/* Email Field */}
              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />

              {/* Password Fields */}
              <input
                type="password"
                placeholder="Current Password"
                value={password.current}
                onChange={(e) => setPassword({ ...password, current: e.target.value })}
              />
              <input
                type="password"
                placeholder="New Password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              />

              <button type="submit" className="btn-primary">Update</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Profile updated successfully!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
