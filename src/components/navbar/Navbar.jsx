import "./navbar.scss"
import SearchIcon from '@mui/icons-material/Search';
import logo from "../../assets/avatar.jpg";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';

const Navbar = () => {
    return (
        <div className="navbar">
         <div className="wrapper">
            <div className="search">
                <input type="text" placeholder="Find..." />
                    <SearchIcon />
            </div>
            <div className="items">
                <div className="item">
                    <LanguageOutlinedIcon className="icon" />
                    English
                    Tagalog
                </div>
                <div className="item">
                    <DarkModeOutlinedIcon className="icon" />
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
                <div className="item">
                    <img src={logo} alt="Profile Logo" className="avatar" />
                </div>
            </div>
         </div>
        </div>
    )
}

export default Navbar