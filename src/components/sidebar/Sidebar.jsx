import "./sidebar.scss"
import logo from "../../assets/FTHarmonyLogo.png";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ReportIcon from '@mui/icons-material/Report';
import PostAddIcon from '@mui/icons-material/PostAdd';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnalyticsIcon from '@mui/icons-material/Analytics';
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
                    <li>
                        <DashboardIcon className="icon" />
                        <span>Dashboard</span>
                    </li>
                    <p className="title">LISTS</p>
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
                    <li>
                        <PostAddIcon className="icon" />
                        <span>Posting</span>
                    </li>
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
                    <p className="title">USER</p>
                    <li>
                        <AccountCircleOutlinedIcon className="icon" />
                        <span>Profile</span>
                    </li>
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