import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./reporting.scss";

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
  {
    id: 2,
    reporterName: "Jane Doe",
    date: "2025-02-06",
    address: "456 Elm St, Suburbia",
    status: "Pending",
    details: {
      victimInfo: {
        fullName: "Mike Brown",
        age: "8-12",
        gender: "Male",
        address: "789 Pine St, Townsville",
        relationship: "Sibling",
        condition: "Signs of malnutrition and anxiety",
      },
      abuserInfo: {
        fullName: "Unknown",
        physicalDescription: "N/A",
        relationship: "N/A",
        address: "N/A",
        history: "Unknown",
      },
      incidentDetails: {
        dateTime: "2025-02-05 3:00 PM",
        location: "School",
        type: ["Neglect"],
        description: "The child appears malnourished and anxious.",
        evidence: ["Photo2.jpg"],
      },
      witnessInfo: {
        names: "Teacher",
        statement: "Noticed signs of neglect over the past month.",
      },
      reporterInfo: {
        name: "Jane Doe",
        contact: "jane.doe@example.com",
        relationship: "Teacher",
      },
    },
  },
];

const Reporting = () => {
  const [reports] = useState(dummyReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => setSelectedReport(null);

  return (
    <div className="reporting">
      <Sidebar />
      <div className="reportingContainer">
        <Navbar />
        <div className="reportingContent">
          {selectedReport ? (
            <div className="reportDetails">
              <button className="backButton" onClick={handleBack}>
                Back to List
              </button>
              <h2>Report Details</h2>
              <div className="detailsSection">
                <h3>Victim's Information</h3>
                <p>
                  <strong>Full Name:</strong> {selectedReport.details.victimInfo.fullName}
                </p>
                <p>
                  <strong>Age:</strong> {selectedReport.details.victimInfo.age}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedReport.details.victimInfo.gender}
                </p>
                <p>
                  <strong>Address:</strong> {selectedReport.details.victimInfo.address}
                </p>
                <p>
                  <strong>Condition:</strong> {selectedReport.details.victimInfo.condition}
                </p>
              </div>
              <div className="detailsSection">
                <h3>Abuser's Information</h3>
                <p>
                  <strong>Full Name:</strong> {selectedReport.details.abuserInfo.fullName}
                </p>
                <p>
                  <strong>Physical Description:</strong> {selectedReport.details.abuserInfo.physicalDescription}
                </p>
                <p>
                  <strong>Relationship:</strong> {selectedReport.details.abuserInfo.relationship}
                </p>
                <p>
                  <strong>Address:</strong> {selectedReport.details.abuserInfo.address}
                </p>
                <p>
                  <strong>Known History:</strong> {selectedReport.details.abuserInfo.history}
                </p>
              </div>
              <div className="detailsSection">
                <h3>Incident Details</h3>
                <p>
                  <strong>Date & Time:</strong> {selectedReport.details.incidentDetails.dateTime}
                </p>
                <p>
                  <strong>Location:</strong> {selectedReport.details.incidentDetails.location}
                </p>
                <p>
                  <strong>Type:</strong> {selectedReport.details.incidentDetails.type.join(", ")}
                </p>
                <p>
                  <strong>Description:</strong> {selectedReport.details.incidentDetails.description}
                </p>
                <p>
                  <strong>Evidence:</strong> {selectedReport.details.incidentDetails.evidence.join(", ")}
                </p>
              </div>
              <div className="detailsSection">
                <h3>Witness Information</h3>
                <p>
                  <strong>Names:</strong> {selectedReport.details.witnessInfo.names}
                </p>
                <p>
                  <strong>Statement:</strong> {selectedReport.details.witnessInfo.statement}
                </p>
              </div>
              <div className="detailsSection">
                <h3>Reporter Information</h3>
                <p>
                  <strong>Name:</strong> {selectedReport.details.reporterInfo.name}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedReport.details.reporterInfo.contact}
                </p>
                <p>
                  <strong>Relationship:</strong> {selectedReport.details.reporterInfo.relationship}
                </p>
              </div>
              <div className="detailsSection actions">
                <button className="statusButton real" onClick={() => navigate("/reports/real")}>
                  Mark as Real
                </button>
                <button className="statusButton fake" onClick={() => navigate("/reports/fake")}>
                  Mark as Fake
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="reportingTitle">Reports</h1>
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
                          onClick={() => navigate("/reports/real")}
                        >
                          Mark as Real
                        </button>
                        <button
                          className="statusButton fake"
                          onClick={() => navigate("/reports/fake")}
                        >
                          Mark as Fake
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reporting;
