export const reportColumns = [
    { field: "id", headerName: "ID", width: 100 },
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
      field: "reportType",
      headerName: "Report Type",
      width: 160,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.reportType}`}>
            {params.row.reportType}
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
  
