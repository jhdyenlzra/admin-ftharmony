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

const Navbar = ({ avatarUpdated }) => {
  const { dispatch } = useContext(DarkModeContext);
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user profile when the component mounts or avatar is updated
  useEffect(() => {

    const createDefaultProfile = async (userId, email) => {
  try {
    const { error } = await supabase.from("users").insert([
      {
        id: userId,
        email: email,
        full_name: "New User", // Default name
        avatar_url: null,
        created_at: new Date(),
      },
    ]);

    if (error) {
      throw error;
    }

    console.log("Default profile created successfully.");
  } catch (err) {
    console.error("Error creating default profile:", err);
  }
};

    const fetchUserProfile = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.error("User not authenticated.");
      return;
    }

    const userId = session.session.user.id;
    setUser(session.session.user);

    const { data: profile, error } = await supabase
      .from("users")
      .select("full_name, avatar_url")
      .eq("id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      console.warn("No profile found for the user.");
      // Optionally, create a new profile for the user here.
      return;
    }

    if (error) {
      throw error;
    }

    if (profile) {
      setAvatar(profile.avatar_url || "../../assets/avatar.jpg"); // Default avatar
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};


    fetchUserProfile();
  }, [avatarUpdated]); // Re-fetch when avatarUpdated changes

  const handleLanguageChange = (lang) => {
    alert(`Language switched to ${lang}`);
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Find..." />
          <SearchIcon />
        </div>
        <div className="items">
          <div className="item" onClick={() => handleLanguageChange("English")}>
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item" onClick={() => handleLanguageChange("Tagalog")}>
            <LanguageOutlinedIcon className="icon" />
            Tagalog
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>
          <Link to="/profile" className="item">
            <img
              src={avatar} // Dynamically updated avatar
              alt={`${user?.email || "Profile"} Logo`}
              className="avatar"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
