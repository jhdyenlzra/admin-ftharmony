export const reportColumns = [
    { field: "id", headerName: "ID", width: 350 },
    {
      field: "reporter",
      headerName: "Reporter",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
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
    {
      field: "timestamp",
      headerName: "Timestamp",
      width: 230,
    },
  ];
  