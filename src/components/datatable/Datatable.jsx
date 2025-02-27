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
      const { data: users, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setData(users.map(user => ({ id: user.user_id, ...user })));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      setData(data.filter((item) => item.id !== id));
      const { error } = await supabase.from('users').delete().eq('user_id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting user:', err);
      fetchUsers(); // Refresh data on delete error
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRows.length} selected users?`
    );

    if (!confirmDelete) return;

    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('users')
        .delete()
        .in('user_id', selectedRows);

      if (error) throw error;

      // Update local state
      setData(data.filter(item => !selectedRows.includes(item.id)));
      setSelectedRows([]); // Clear selection
    } catch (err) {
      console.error('Error deleting users:', err);
      fetchUsers(); // Refresh data on error
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
            <Link to={`/users/${params.row.id}`} style={{ textDecoration: "none" }}>
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
        <div>Loading...</div>
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
