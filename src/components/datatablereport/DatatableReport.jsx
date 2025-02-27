import "./datatablereport.scss";
import { DataGrid } from "@mui/x-data-grid";
import { reportColumns } from "../../datatablereportsource";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const DatatableReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: reportsData, error } = await supabase
        .from('reports')
        .select('*');
      
      if (error) throw error;
      
      setReports(reportsData.map(report => ({
        id: report.report_id,
        ...report
      })));
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMarkAs = async (event, id, type) => {
    event.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('reports')
        .update({ reportType: type })
        .eq('report_id', id);

      if (error) throw error;
      
      // Update local state
      setReports(reports.map(report => 
        report.id === id ? { ...report, reportType: type } : report
      ));

      // Navigate to the corresponding reports section
      if (type === 'real') {
        setFilterType('real');
        navigate('/reports?filter=real');
      } else if (type === 'fake') {
        setFilterType('fake');
        navigate('/reports?filter=fake');
      }
    } catch (err) {
      console.error('Error updating report:', err);
    }
  };

  // Add useEffect to handle URL params for filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      setFilterType(filterParam);
    }
  }, []);

  const handleFilterClick = (type) => {
    setFilterType(type);
    navigate(`/reports${type !== 'all' ? `?filter=${type}` : ''}`);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction" onClick={(e) => e.stopPropagation()}>
            <Link 
              to={`/reports/${params.row.id}`} 
              style={{ textDecoration: "none" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="viewButton">View</div>
            </Link>
            <select 
              className="statusSelect"
              onChange={(e) => handleMarkAs(e, params.row.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              value={params.row.reportType || ''}
            >
              <option value="" disabled>Mark as</option>
              <option value="real">Real</option>
              <option value="fake">Fake</option>
            </select>
          </div>
        );
      },
    },
  ];

  const filteredReports = reports.filter(report => {
    if (filterType === 'all') return true;
    return report.reportType === filterType;
  });

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="datatable">
          <div className="datatableTitle">
            Manage Reports
            <div className="filterButtons">
              <button 
                className={`filterButton ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterClick('all')}
              >
                All Reports
              </button>
              <button 
                className={`filterButton ${filterType === 'real' ? 'active' : ''}`}
                onClick={() => handleFilterClick('real')}
              >
                Real Reports
              </button>
              <button 
                className={`filterButton ${filterType === 'fake' ? 'active' : ''}`}
                onClick={() => handleFilterClick('fake')}
              >
                Fake Reports
              </button>
            </div>
            <Link to="/reports/new" className="link">
              Add New Report
            </Link>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <DataGrid
              className="datagrid"
              rows={filteredReports}
              columns={reportColumns.concat(actionColumn)}
              pageSize={9}
              rowsPerPageOptions={[9]}
              checkboxSelection
              disableSelectionOnClick={false} // Enable row selection on click
              onRowClick={(params, event) => {
                // Only prevent row selection for specific elements
                if (
                  event.target.closest('.viewButton') || 
                  event.target.closest('.statusSelect')
                ) {
                  event.stopPropagation();
                  return;
                }
                // Allow normal row click behavior for other areas
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DatatableReport;
