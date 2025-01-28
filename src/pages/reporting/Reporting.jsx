import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./reporting.scss";

const Reporting = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reports from Supabase or your data source
  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: reportsData, error } = await supabase.from("reports").select("*");
      if (error) throw error;
      setReports(reportsData);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportStatusChange = async (reportId, status) => {
    try {
      await supabase.from("reports").update({ status }).eq("id", reportId);
      setReports(reports.map((report) => (report.id === reportId ? { ...report, status } : report)));
    } catch (err) {
      console.error("Error updating report status:", err);
    }
  };

  return (
    <div className="reporting">
      <div className="reportingTitle">Reports</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="reportTable">
          <thead>
            <tr>
              <th>Reporter Name</th>
              <th>Date</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.reporter_name}</td>
                <td>{report.date}</td>
                <td>{report.address}</td>
                <td>
                  <div className="dropdown">
                    <button className="dropdown-btn">•••</button>
                    <div className="dropdown-content">
                      <button
                        onClick={() => handleReportStatusChange(report.id, "Real")}
                        className="dropdown-item"
                      >
                        Mark as Real
                      </button>
                      <button
                        onClick={() => handleReportStatusChange(report.id, "Fake")}
                        className="dropdown-item"
                      >
                        Mark as Fake
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reporting;
