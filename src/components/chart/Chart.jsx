import React, { useEffect, useState } from "react";
import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../supabaseClient"; // Adjust the path based on your project structure

const Chart = ({ aspect, title }) => {
  const [data, setData] = useState([]);

  // Function to fetch reports data from Supabase
  const fetchReportsData = async () => {
    try {
      const { data: reports, error } = await supabase
        .from("reports") // Replace with your Supabase reports table name
        .select("created_at");

      if (error) throw error;

      // Process data to group by month
      const monthlyData = Array(12).fill(0); // Initialize an array for each month

      reports.forEach((report) => {
        const month = new Date(report.created_at).getMonth(); // Get the month index (0-11)
        monthlyData[month] += 1; // Increment the count for the respective month
      });

      // Format data for the chart
      const formattedData = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
      ].map((month, index) => ({
        name: month,
        Total: monthlyData[index],
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching reports data:", error.message);
    }
  };

  useEffect(() => {
    fetchReportsData();

    // Set up real-time subscription for updates
    const subscription = supabase
      .channel("reports-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        () => {
          fetchReportsData(); // Re-fetch data on new report
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Clean up subscription
    };
  }, []);

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="teal" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
