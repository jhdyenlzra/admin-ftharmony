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

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [avatar, setAvatar] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        setUser(session.session.user);
        const { data: profile, error } = await supabase
          .from("profile")
          .select("display_name, avatar_url")
          .eq("id", session.session.user.id)
          .single();

        if (profile && !error) {
          setAvatar(profile.avatar_url);
        }
      }
    };

    fetchUserProfile();
  }, []);

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
              src={avatar || "../../assets/avatar.jpg"} // Fallback to default avatar
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
