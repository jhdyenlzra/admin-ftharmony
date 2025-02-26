export const userColumns = [
  { field: "id", headerName: "ID", width: 350 },
  {
    field: "user",
    headerName: "User",
    width: 90,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "address",
    headerName: "Address",
    width: 230,
  },
  {
    field: "role",
    headerName: "Role",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];