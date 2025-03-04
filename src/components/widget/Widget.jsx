import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./widget.scss";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { supabase } from "../../supabaseClient";

const Widget = ({ type }) => {
  const navigate = useNavigate(); // Initialize navigate
  const [value, setValue] = useState(0); // Holds the count for each widget
  const [diff, setDiff] = useState(0); // Placeholder for percentage difference

  useEffect(() => {
    const fetchData = async () => {
      if (type === "user") {
        // Fetch the total number of users
        const { count, error } = await supabase
          .from("users")
          .select("*", { count: "exact" });

        if (error) {
          console.error("Error fetching users:", error);
        } else {
          setValue(count || 0);
        }
      }

      if (type === "report") {
        // Fetch the total number of reports
        const { count, error } = await supabase
          .from("reports")
          .select("*", { count: "exact" });

        if (error) {
          console.error("Error fetching reports:", error);
        } else {
          setValue(count || 0);
        }
      }
    };

    fetchData();
  }, [type]);

  // Define widget-specific data
  let data;
  switch (type) {
    case "user":
      data = {
        title: "USERS",
        link: "See all users",
        icon: <PersonOutlinedIcon className="icon user" />,
        navigateTo: "/users", // Path for Users page
      };
      break;
    case "report":
      data = {
        title: "REPORTS",
        link: "View all reports",
        icon: <ReportProblemOutlinedIcon className="icon report" />,
        navigateTo: "/reports", // Path for Reports page
      };
      break;
    default:
      data = {};
      break;
  }

  // Handle navigation when link is clicked
  const handleLinkClick = () => {
    if (data.navigateTo) {
      navigate(data.navigateTo);
    }
  };

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{value}</span>
        <span className="link" onClick={handleLinkClick}>
          {data.link}
        </span>
      </div>
      <div className="right">
        <div className={`percentage ${diff >= 0 ? "positive" : "negative"}`}>
          <KeyboardArrowUpOutlinedIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
