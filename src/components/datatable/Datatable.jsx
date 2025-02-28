import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match the expected format
      const transformedData = users.map(user => ({
        id: user.id,
        user: {
          img: user.avatar_url || "../../assets/avatar.jpg",
          username: user.full_name
        },
        full_name: user.full_name,
        email: user.email,
        status: user.last_sign_in_at ? 
          (new Date() - new Date(user.last_sign_in_at) < 300000 ? 'active' : 'inactive') 
          : 'pending',
        role: user.role || 'User',
      }));
      
      setData(transformedData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchUsers();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('users_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        payload => {
          fetchUsers(); // Refresh the data when changes occur
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const actionColumn = [{
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellAction">
          <Link to={`/users/${params.row.id}`} style={{ textDecoration: "none" }}>
            <div className="viewButton">View</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </div>
        </div>
      );
    },
  }];

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .in('id', selectedRows);
      
      if (error) throw error;
      
      setData(data.filter((item) => !selectedRows.includes(item.id)));
      setSelectedRows([]);
    } catch (err) {
      console.error('Error deleting users:', err);
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Manage Users
        <div className="actionButtons">
          {selectedRows.length > 0 && (
            <button 
              className="bulkDeleteButton"
              onClick={handleBulkDelete}
            >
              Delete Selected ({selectedRows.length})
            </button>
          )}
          <Link to="/users/new" className="link">
            Add New User
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="loadingState">Loading...</div>
      ) : (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={userColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
        />
      )}
    </div>
  );
};

export default Datatable;
