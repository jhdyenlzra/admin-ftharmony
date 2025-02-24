import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { supabase } from "../../supabaseClient";
import avatar from "../../assets/avatar.jpg"; // Default avatar path
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import "./profile.scss";

const Profile = ({ onAvatarUpdate }) => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    avatarUrl: avatar,
  });
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          setError("User not authenticated.");
          return;
        }

        const { id } = session.session.user;
        const { data, error } = await supabase
          .from("users")
          .select("full_name, email, avatar_url, created_at")
          .eq("id", id)
          .single();

        if (error) throw error;

        setProfile({
          fullName: data.full_name || "",
          email: data.email || "",
          avatarUrl: data.avatar_url || avatar,
        });
      } catch (err) {
        setError(err.message || "Error fetching profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatarFile(file);
      setIsEditingAvatar(true);
    }
  };

  // Upload avatar to Supabase storage
  const uploadAvatar = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from("avatars").upload(fileName, file);

  if (error) throw new Error("Failed to upload avatar.");

  const { publicUrl } = supabase.storage.from("avatars").getPublicUrl(data.path);
  return publicUrl;
};

  // Handle profile update submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError("User not authenticated.");
        return;
      }

      const { id } = session.session.user;

      // Upload avatar if new file is selected
      const avatarUrl = newAvatarFile ? await uploadAvatar() : profile.avatarUrl;

      const updates = {
        full_name: profile.fullName,
        avatar_url: avatarUrl,
      };

      const { error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      // Update profile and Navbar avatar
      setProfile((prev) => ({ ...prev, avatarUrl }));
      setNewAvatarFile(null);
      setIsEditingAvatar(false);
      setSuccess("Profile updated successfully!");
      onAvatarUpdate(avatarUrl);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  };

  return (
    <div className="profile">
      <Sidebar />
      <div className="profileContainer">
        <Navbar />
        <div className="profileContent">
          <h2>Profile</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleFormSubmit} className="profileForm">
              {/* Avatar Section */}
              <div className="avatarSection">
                <div className="avatar__wrapper">
                  <img
                    className="profile__avatar"
                    src={
                      newAvatarFile
                        ? URL.createObjectURL(newAvatarFile)
                        : profile.avatarUrl
                    }
                    alt="User Avatar"
                  />
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
                      <CheckIcon
                        className="iconButton"
                        onClick={() => setIsEditingAvatar(false)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="formGroup">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="formGroup">
                <label>Email</label>
                <input type="email" value={profile.email} disabled />
              </div>

              <button type="submit" className="btn-primary">
                Update Profile
              </button>

              {/* Feedback Messages */}
              {success && <p className="successMessage">{success}</p>}
              {error && <p className="errorMessage">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
