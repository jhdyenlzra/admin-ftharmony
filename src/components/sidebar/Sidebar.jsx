import "./sidebar.scss"
import logo from "../../assets/FTHarmonyLogo.png";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ReportIcon from '@mui/icons-material/Report';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArticleIcon from '@mui/icons-material/Article';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {Link} from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const Sidebar = () => {
    const { dispatch } = useContext(DarkModeContext);

    return (
        <div className="sidebar">
            <div className="logo">
                <Link to="/" style={{textDecoration:"none"}}>
                <img src={logo} alt="FTHarmony Logo" className="logo-img" />
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <Link to="/home" style={{textDecoration:"none"}}>
                    <li>
                        <DashboardIcon className="icon" />
                        <span>Dashboard</span>
                    </li>
                    </Link>
                    <p className="title">LISTS</p>
                    <Link to="/admin-users" style={{textDecoration:"none"}}>
                    <li>
                        <AdminPanelSettingsIcon className="icon" />
                        <span>Admin</span>
                    </li>
                    </Link> 
                    <Link to="/users" style={{textDecoration:"none"}}>
                    <li>
                        <GroupIcon className="icon" />
                        <span>Users</span>
                    </li>
                    </Link> 
                    <Link to="/reports" style={{textDecoration:"none"}}>
                    <li>
                        <ReportIcon className="icon" />
                        <span>Reports</span>
                    </li>
                    </Link>
                    <Link to="/create" style={{textDecoration:"none"}}>
                    <li>
                        <PostAddIcon className="icon" />
                        <span>Posting</span>
                    </li>
                    </Link>
                    <li>
                        <MessageIcon className="icon" />
                        <span>Messages</span>
                    </li>
                    <p className="title">USEFUL</p>
                    <li>
                        <NotificationsIcon className="icon" />
                        <span>Notifications</span>
                    </li>
                    <li>
                        <AnalyticsIcon className="icon" />
                        <span>Analytics</span>
                    </li>
                    <Link to="/posts" style={{textDecoration:"none"}}>
                    <li>
                        <ArticleIcon className="icon" />
                        <span>Articles</span>
                    </li>
                    </Link>
                    <p className="title">USER</p>
                    <Link to="/profile" style={{ textDecoration: "none" }}>
                    <li>
                        <AccountCircleOutlinedIcon className="icon" />
                        <span>Profile</span>
                    </li>
                    </Link>
                    <li>
                        <LogoutOutlinedIcon className="icon" />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption" onClick={()=> dispatch({type:"LIGHT"})}></div>
                <div className="colorOption" onClick={()=> dispatch({type:"DARK"})}></div>
            </div>
        </div>
    )
}

export default Sidebar