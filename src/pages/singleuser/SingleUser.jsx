import React, { useState, useEffect } from "react";
import "./singleuser.scss";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";

const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Invalid user ID:", id);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        console.log("Fetched user data:", data); // Debugging
        setUser(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data found.</div>;

  // Format the registered date
  let formattedDate = "Invalid Date";
  if (user.created_at) {
    try {
      const parsedDate = new Date(user.created_at); // Ensure correct parsing
      formattedDate = parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error parsing created_at date:", err);
    }
  }
  console.log("Registered Date:", formattedDate);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={user.avatar_url || "/default-avatar.jpg"}
                alt="User profile"
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{user.full_name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Registered Date:</span>
                  <span className="itemValue">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last Year )" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Reports</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default SingleUser;
