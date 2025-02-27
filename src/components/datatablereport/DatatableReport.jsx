import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { reportColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: reportsData, error } = await supabase.from('reports').select('*');
      if (error) throw error;
      setReports(reportsData.map(report => ({ id: report.report_id, ...report })));
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      setReports(reports.filter((item) => item.id !== id));
      const { error } = await supabase.from('reports').delete().eq('report_id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting report:', err);
      fetchReports(); // Refresh data on delete error
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/reports/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Manage Reports
        <Link to="/reports/new" className="link">
          Add New Report
        </Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataGrid
          className="datagrid"
          rows={reports}
          columns={reportColumns.concat(actionColumn)}
          pageSize={3}
          rowsPerPageOptions={[9]}
          checkboxSelection
          disableSelectionOnClick
        />
      )}
    </div>
  );
};

export default ReportManagement;
