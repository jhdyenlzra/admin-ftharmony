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
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add new function to handle key press
  const handleKeyPress = async (e, formType) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      
      if (formType === 'profile') {
        await handleFormSubmit(e);
      } else if (formType === 'password') {
        await handlePasswordChange();
      }
    }
  };

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

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
        .select("full_name, email, avatar_url")
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatarFile(file);
      setIsEditingAvatar(true);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      // Generate unique filename
      const fileName = `avatars/${Date.now()}_${file.name}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw new Error("Failed to upload avatar.");
    }
  };

  const handlePasswordChange = async () => {
    setError(null);
    setSuccess(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword,
      });

      if (error) throw error;

      setSuccess("Password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to update password.");
    }
  };

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
      let avatarUrl = profile.avatarUrl;

      // Upload new avatar if file selected
      if (newAvatarFile) {
        avatarUrl = await uploadAvatar(newAvatarFile);
      }

      // Update user profile in the users table
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: profile.fullName,
          avatar_url: avatarUrl
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => ({ ...prev, avatarUrl }));
      setNewAvatarFile(null);
      setIsEditingAvatar(false);
      setSuccess("Profile updated successfully!");

      // Notify parent component about avatar update
      if (onAvatarUpdate) {
        onAvatarUpdate(avatarUrl);
      }
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
          <h2>Profile Settings</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="profileForms">
              <form onSubmit={handleFormSubmit} className="profileForm">
                <div className="avatarSection">
                  <div className="avatar__wrapper">
                    <img
                      className="profile__avatar"
                      src={newAvatarFile ? URL.createObjectURL(newAvatarFile) : profile.avatarUrl}
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

                <div className="formGroup">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, 'profile')}
                    required
                  />
                </div>

                <div className="formGroup">
                  <label>Email</label>
                  <input type="email" value={profile.email} disabled />
                </div>

                <button type="submit" className="btn-primary">
                  Update Profile
                </button>
              </form>

              <div className="passwordForm">
                <h3>Change Password</h3>
                <div className="formGroup">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, 'password')}
                  />
                </div>

                <div className="formGroup">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, 'password')}
                  />
                </div>

                <div className="formGroup">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, 'password')}
                  />
                </div>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handlePasswordChange}
                >
                  Change Password
                </button>
              </div>

              {success && <p className="successMessage">{success}</p>}
              {error && <p className="errorMessage">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
