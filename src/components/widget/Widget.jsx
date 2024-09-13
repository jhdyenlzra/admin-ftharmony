import "./widget.scss";
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';

const Widget = ({ type }) => {
    let data;

    // Temporary values for demonstration
    const diff = 30; // Percentage difference for each widget

    switch(type) {
        case "user":
            data = {
                title: "USERS",
                value: "1000",
                link: "See all users",
                percentage: diff, // Percentage difference for users
                icon: <PersonOutlinedIcon className="icon user" />, // Added user class for styling
            };
            break;
        case "report":
            data = {
                title: "REPORTS",
                value: "200",
                link: "View all reports",
                percentage: diff, // Percentage difference for reports
                icon: <ReportProblemOutlinedIcon className="icon report" />, // Added report class
            };
            break;
        case "educational":
            data = {
                title: "EDUCATIONAL",
                value: "75%",
                link: "See all educational",
                percentage: diff, // Percentage difference for educational stats
                icon: <HistoryEduOutlinedIcon className="icon educational" />, // Added educational class
            };
            break;
        case "total":
            data = {
                title: "SCHEDULING",
                value: "20",
                link: "See All Schedules",
                percentage: diff, // Percentage difference for total stats
                icon: <EventNoteIcon className="icon schedule" />, // Added schedule class
            };
            break;
        default:
            break;
    }

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{data.value}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">
                <div className={`percentage ${data.percentage >= 0 ? 'positive' : 'negative'}`}>
                    <KeyboardArrowUpOutlinedIcon />
                    {data.percentage} %
                </div>
                {data.icon} {/* Use icon from data object */}
            </div>
        </div>
    );
};

export default Widget;
