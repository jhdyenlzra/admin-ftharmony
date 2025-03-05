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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      // First, check if user has an avatar
      const userToDelete = data.find(user => user.id === id);
      if (userToDelete?.user?.img && !userToDelete.user.img.includes('avatar.jpg')) {
        // Extract avatar filename from URL
        const avatarPath = userToDelete.user.img.split('/').pop();
        
        // Delete avatar from storage
        await supabase.storage
          .from('avatars')
          .remove([avatarPath]);
      }

      // Delete user from database
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setData(data.filter((item) => item.id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user: ${err.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} users?`)) {
      return;
    }

    try {
      // First, handle avatars
      const usersToDelete = data.filter(user => selectedRows.includes(user.id));
      for (const user of usersToDelete) {
        if (user?.user?.img && !user.user.img.includes('avatar.jpg')) {
          const avatarPath = user.user.img.split('/').pop();
          await supabase.storage
            .from('avatars')
            .remove([avatarPath]);
        }
      }

      // Delete users from database
      const { error } = await supabase
        .from('users')
        .delete()
        .in('id', selectedRows);
      
      if (error) throw error;
      
      // Update local state
      setData(data.filter((item) => !selectedRows.includes(item.id)));
      setSelectedRows([]);
      alert("Users deleted successfully!");
    } catch (err) {
      console.error('Error deleting users:', err);
      alert(`Failed to delete users: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();

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
