import React, { useState, useEffect } from "react";
import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { supabase } from "../../supabaseClient"; // Adjust the path to your Supabase client

const Featured = () => {
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    target: 100, // Default target value
  });
  const [progress, setProgress] = useState(0);

  const fetchStatistics = async () => {
    try {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Fetch today's statistics
      const { count: todayCount } = await supabase
        .from("reports") // Replace with your reports table name
        .select("*", { count: "exact" })
        .gte("created_at", startOfToday.toISOString());

      // Fetch this week's statistics
      const { count: weekCount } = await supabase
        .from("reports")
        .select("*", { count: "exact" })
        .gte("created_at", startOfWeek.toISOString());

      // Fetch this month's statistics
      const { count: monthCount } = await supabase
        .from("reports")
        .select("*", { count: "exact" })
        .gte("created_at", startOfMonth.toISOString());

      // Update state
      setStats({
        today: todayCount || 0,
        week: weekCount || 0,
        month: monthCount || 0,
        target: 100, // Update target if needed
      });

      // Update progress (percentage of today's stats towards the target)
      setProgress(((todayCount || 0) / 100) * 100); // Adjust divisor to match your target
    } catch (error) {
      console.error("Error fetching statistics:", error.message);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Statistics</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={progress} text={`${Math.round(progress)}%`} strokeWidth={5} />
        </div>
        <p className="title">Total statistics today</p>
        <p className="date">{new Date().toLocaleDateString()}</p>
        <p className="desc">Previous statistics. Last day may not be included.</p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target</div>
            <div className={`itemResult ${stats.today < stats.target ? "negative" : "positive"}`}>
              {stats.today < stats.target ? (
                <KeyboardArrowDownIcon fontSize="small" />
              ) : (
                <KeyboardArrowUpIcon fontSize="small" />
              )}
              <div className="resultStats">{stats.target}%</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div className="itemResult positive">
              <KeyboardArrowUpIcon fontSize="small" />
              <div className="resultStats">{stats.week}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Month</div>
            <div className="itemResult positive">
              <KeyboardArrowUpIcon fontSize="small" />
              <div className="resultStats">{stats.month}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
