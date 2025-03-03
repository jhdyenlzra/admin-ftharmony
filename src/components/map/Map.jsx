import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.scss";
import configData from "../../config";
import Box from "@mui/material/Box";
import MapNavbar from "../MapNavbar";
import { supabase } from "../../supabaseClient";


export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const center = { lng: 120.294113, lat: 14.836620 };
  const [zoom] = useState(9.79);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reports, setReports] = useState([]);

  maptilersdk.config.apiKey = configData.MAPTILER_API_KEY;

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  useEffect(() => {
    // Fetch reports from Supabase
    const fetchReports = async () => {
      const { data, error } = await supabase.from("reports").select("latitude, longitude");
      if (error) {
        console.error("Error fetching reports:", error);
      } else {
        console.log("Fetched reports:", data);
        setReports(data);
      }
    };

    fetchReports();
  }, []);


  useEffect(() => {
    if (!map.current) {
      // Initialize the map only once
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [center.lng, center.lat],
        zoom: zoom,
      });
    }
  
    if (map.current && reports.length > 0) {
      // Add markers for each report
      reports.forEach((report) => {
        if (report.latitude && report.longitude) {
          new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat([report.longitude, report.latitude])
            .addTo(map.current);
        } else {
          console.warn("Invalid report coordinates:", report);
        }
      });
    }
  }, [reports]);  
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Add Navbar */}
      <MapNavbar handleDrawerOpen={() => {}} open={false} />
  
      {/* Map container */}
      <Box className="container">
        <div ref={mapContainer} id="map" className="map" />
      </Box>
    </Box>
  );  
}
