import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./reporting.scss";

// Dummy Data
const dummyReports = [
  {
    id: 1,
    reporterName: "John Doe",
    date: "2025-02-05",
    address: "123 Main St, Cityville",
    status: "Pending",
    details: {
      victimInfo: {
        fullName: "Jane Smith",
        age: "13-17",
        gender: "Female",
        address: "456 Elm St, Suburbia",
        relationship: "Parent",
        condition: "Bruises on arms and seems distressed",
      },
      abuserInfo: {
        fullName: "Mark Smith",
        physicalDescription: "Tall, medium build, wearing glasses",
        relationship: "Parent",
        address: "456 Elm St, Suburbia",
        history: "Yes",
      },
      incidentDetails: {
        dateTime: "2025-02-04 10:00 AM",
        location: "Home",
        type: ["Physical", "Emotional"],
        description: "Frequent shouting, slapping, and verbal abuse",
        evidence: ["Photo1.jpg", "Audio1.mp3"],
      },
      witnessInfo: {
        names: "Jane's Neighbor",
        statement: "Frequently hears shouting and sees bruises on Jane.",
      },
      reporterInfo: {
        name: "John Doe",
        contact: "john.doe@example.com",
        relationship: "Neighbor",
      },
    },
  },
];

const Reporting = () => {
  const [reports, setReports] = useState(dummyReports);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleReportStatusChange = (id, status) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status } : report
      )
    );
  };

  return (
    <div className="reporting">
      <Sidebar />
      <div className="reportingContainer">
        <Navbar />
        <div className="reportingContent">
          <h1 className="reportingTitle">Reports</h1>
          {selectedReport ? (
            <div className="reportDetails">
              <h2>Report Details</h2>
              <button
                className="backButton"
                onClick={() => setSelectedReport(null)}
              >
                Back to List
              </button>

              {/* Victim's Information */}
              <div className="detailsSection">
                <h3>Victim's Information</h3>
                <p><strong>Full Name:</strong> {selectedReport.details.victimInfo.fullName || "Anonymous"}</p>
                <p><strong>Age:</strong> {selectedReport.details.victimInfo.age}</p>
                <p><strong>Gender:</strong> {selectedReport.details.victimInfo.gender}</p>
                <p><strong>Address:</strong> {selectedReport.details.victimInfo.address}</p>
                <p><strong>Condition:</strong> {selectedReport.details.victimInfo.condition}</p>
              </div>

              {/* Abuser's Information */}
              <div className="detailsSection">
                <h3>Abuser's Information</h3>
                <p><strong>Full Name:</strong> {selectedReport.details.abuserInfo.fullName || "Unknown"}</p>
                <p><strong>Physical Description:</strong> {selectedReport.details.abuserInfo.physicalDescription}</p>
                <p><strong>Relationship:</strong> {selectedReport.details.abuserInfo.relationship}</p>
                <p><strong>Address:</strong> {selectedReport.details.abuserInfo.address || "Unknown"}</p>
                <p><strong>Known History:</strong> {selectedReport.details.abuserInfo.history}</p>
              </div>

              {/* Incident Details */}
              <div className="detailsSection">
                <h3>Incident Details</h3>
                <p><strong>Date & Time:</strong> {selectedReport.details.incidentDetails.dateTime}</p>
                <p><strong>Location:</strong> {selectedReport.details.incidentDetails.location}</p>
                <p><strong>Type:</strong> {selectedReport.details.incidentDetails.type.join(", ")}</p>
                <p><strong>Description:</strong> {selectedReport.details.incidentDetails.description}</p>
                <p><strong>Evidence:</strong> {selectedReport.details.incidentDetails.evidence.join(", ")}</p>
              </div>

              {/* Witness Information */}
              <div className="detailsSection">
                <h3>Witness Information</h3>
                <p><strong>Names:</strong> {selectedReport.details.witnessInfo.names || "Anonymous"}</p>
                <p><strong>Statement:</strong> {selectedReport.details.witnessInfo.statement}</p>
              </div>

              {/* Reporter's Information */}
              <div className="detailsSection">
                <h3>Reporter Information</h3>
                <p><strong>Name:</strong> {selectedReport.details.reporterInfo.name || "Anonymous"}</p>
                <p><strong>Contact:</strong> {selectedReport.details.reporterInfo.contact || "N/A"}</p>
                <p><strong>Relationship:</strong> {selectedReport.details.reporterInfo.relationship}</p>
              </div>
            </div>
          ) : (
            <table className="reportTable">
              <thead>
                <tr>
                  <th>Reporter Name</th>
                  <th>Date</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.reporterName}</td>
                    <td>{report.date}</td>
                    <td>{report.address}</td>
                    <td>{report.status}</td>
                    <td>
                      <button
                        className="viewButton"
                        onClick={() => setSelectedReport(report)}
                      >
                        View
                      </button>
                      <button
                        className="statusButton real"
                        onClick={() => handleReportStatusChange(report.id, "Real")}
                      >
                        Mark as Real
                      </button>
                      <button
                        className="statusButton fake"
                        onClick={() => handleReportStatusChange(report.id, "Fake")}
                      >
                        Mark as Fake
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reporting;