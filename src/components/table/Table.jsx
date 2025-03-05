import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Initialize Supabase client
const supabaseUrl = "https://mwldwdhnlnsjccefhmcf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bGR3ZGhubG5zamNjZWZobWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY3NTMxMzMsImV4cCI6MjAzMjMyOTEzM30.-t7DZbCEBC7X8mDPrJK0SffqbSfhmt6Wj8e2G4e2No0";
const supabase = createClient(supabaseUrl, supabaseKey);

const TableList = () => {
  const [rows, setRows] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("id, reporter_name, relationship_with_abuser, abuser_name, created_at")
        .order("created_at", { ascending: false })
        .limit(3);
  
      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        console.log("Fetched reports:", data);
        setRows(data);
      }
    };
  
    fetchReports();
  
    const channel = supabase
      .channel("public:reports")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, (payload) => {
        console.log("Real-time update received:", payload);
        setRows((prevRows) => [payload.new, ...prevRows].slice(0, 3));
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Tracking ID</TableCell>
            <TableCell className="tableCell">Reporter</TableCell>
            <TableCell className="tableCell">Relationship</TableCell>
            <TableCell className="tableCell">Reported Person</TableCell>
            <TableCell className="tableCell">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <span className="reporter">{row.reporter_name}</span>
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.relationship_with_abuser}</TableCell>
              <TableCell className="tableCell">{row.abuser_name}</TableCell>
              <TableCell className="tableCell">{row.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableList;
