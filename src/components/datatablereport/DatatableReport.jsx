import "./datatablereport.scss";
import { DataGrid } from "@mui/x-data-grid";
import { reportColumns } from "../../datatablereportsource";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const DatatableReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();

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

  // Initialize filterType from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam) {
      setFilterType(filterParam);
    }
  }, [location.search]);

  // Set up real-time subscription
  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel('reports_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reports' 
        }, 
        payload => {
          if (payload.eventType === 'UPDATE') {
            // Update the specific report in the local state
            setReports(prevReports => 
              prevReports.map(report => 
                report.report_id === payload.new.report_id ? { id: payload.new.report_id, ...payload.new } : report
              )
            );
          } else {
            // For other changes (INSERT, DELETE), fetch all reports
            fetchReports();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        navigate('/reports?filter=real', { replace: true });
      } else if (type === 'fake') {
        setFilterType('fake');
        navigate('/reports?filter=fake', { replace: true });
      }
    } catch (err) {
      console.error('Error updating report:', err);
    }
  };

  const handleFilterClick = (type) => {
    setFilterType(type);
    navigate(`/reports${type !== 'all' ? `?filter=${type}` : ''}`, { replace: true });
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
              disableSelectionOnClick
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DatatableReport;
