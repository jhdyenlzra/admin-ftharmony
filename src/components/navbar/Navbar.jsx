import { Link } from "react-router-dom";
import "./navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import DefaultAvatar from "../../assets/avatar.jpg";

const Navbar = ({ avatarUpdated }) => {
  const { dispatch } = useContext(DarkModeContext);
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [user, setUser] = useState(null);

  // Function to create a default profile if none exists
  const createDefaultProfile = async (userId, email) => {
    try {
      const { error } = await supabase.from("users").insert([
        {
          id: userId,
          email: email,
          full_name: "New User",
          avatar_url: null,
          created_at: new Date(),
        },
      ]);
      if (error) throw error;

      console.log("Default profile created successfully.");
    } catch (err) {
      console.error("Error creating default profile:", err.message);
    }
  };

  // Fetch user profile and avatar
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

        if (error && error.code === "PGRST116") {
          console.warn("No profile found. Creating default profile...");
          await createDefaultProfile(currentUser.id, currentUser.email);
          return;
        }
        if (error) throw error;

        setAvatar(profile?.avatar_url || DefaultAvatar);
      } catch (err) {
        console.error("Error fetching user profile:", err.message);
      }
    };

    fetchUserProfile();
  }, [avatarUpdated]);

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
          {/* Language Options */}
          <div
            className="item"
            onClick={() => handleLanguageChange("English")}
            title="Switch to English"
          >
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div
            className="item"
            onClick={() => handleLanguageChange("Tagalog")}
            title="Switch to Tagalog"
          >
            <LanguageOutlinedIcon className="icon" />
            Tagalog
          </div>

          {/* Dark Mode Toggle */}
          <div
            className="item"
            onClick={() => dispatch({ type: "TOGGLE" })}
            title="Toggle Dark Mode"
          >
            <DarkModeOutlinedIcon className="icon" />
          </div>

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
