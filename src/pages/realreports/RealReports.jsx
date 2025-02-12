import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./realreports.scss";

const FakeReports = () => {
  return (
    <div className="fakereports">
      <Sidebar />
      <div className="fakereportsContainer">
        <Navbar />
        <div className="fakereportsContent">
          <h1 className="fakereportsTitle">Fake Reports</h1>
          <p>No fake reports yet.</p>
        </div>
      </div>
    </div>
  );
};

export default FakeReports;
