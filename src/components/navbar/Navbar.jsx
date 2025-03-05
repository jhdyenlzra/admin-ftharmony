import { Link } from "react-router-dom";
import "./navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import DefaultAvatar from "../../assets/avatar.jpg";

const Navbar = ({ avatarUpdated }) => {
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        const currentUser = session?.session?.user;

        if (!currentUser) {
          console.warn("User not authenticated.");
          return;
        }

        setUser(currentUser);

        const { data: profile, error } = await supabase
          .from("users")
          .select("avatar_url")
          .eq("id", currentUser.id)
          .single();

        if (error) throw error;

        setAvatar(profile?.avatar_url || DefaultAvatar);
      } catch (err) {
        console.error("Error fetching user profile:", err.message);
        setAvatar(DefaultAvatar);
      }
    };

    fetchUserProfile();
  }, [avatarUpdated]); // Add avatarUpdated to dependency array

  // Handle language switching
  const handleLanguageChange = (lang) => {
    alert(`Language switched to ${lang}`);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        {/* Search Bar */}
        <div className="search">
          <input type="text" placeholder="Find..." />
          <SearchIcon />
        </div>

        {/* Navbar Items */}
        <div className="items">

          {/* Fullscreen Toggle */}
          <div className="item" title="Exit Fullscreen">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>

          {/* Notifications */}
          <div className="item" title="Notifications">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>

          {/* List View */}
          <div className="item" title="Menu">
            <ListOutlinedIcon className="icon" />
          </div>

          {/* User Avatar */}
          <Link to="/profile" className="item" title="View Profile">
            <img
              src={avatar}
              alt={`${user?.email || "User"}'s Avatar`}
              className="avatar"
              onError={(e) => (e.target.src = DefaultAvatar)} // Fallback for broken images
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
