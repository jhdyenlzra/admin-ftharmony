import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.scss";
import configData from "../../config";
import Box from "@mui/material/Box";
import MapNavbar from "../MapNavbar";
import MapSidebar from "../MapSidebar";
import { supabase } from "../../supabaseClient";
import { styled } from "@mui/material/styles";

// Sidebar drawer width
const drawerWidth = 240;

// Styled Main component for layout adjustments
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  marginLeft: open ? `${drawerWidth}px` : 0,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Map() {
  const mapContainer = useRef(null); // Reference to the map container
  const map = useRef(null); // Reference to the map instance
  const markers = useRef([]); // Array to store markers
  const [reports, setReports] = useState([]); // State for fetched reports
  const [mapSidebarOpen, setMapSidebarOpen] = useState(false); // Sidebar state
  const [clickedItem, setClickedItem] = useState(null); // Currently clicked marker's details

  // Map center and zoom level
  const center = { lng: 120.294113, lat: 14.83662 };
  const zoom = 9.79;

  // Set the MapTiler API key
  maptilersdk.config.apiKey = configData.MAPTILER_API_KEY;

  // Fetch reports from Supabase
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase.from("reports").select("*");
        if (error) {
          console.error("Error fetching reports:", error);
        } else {
          console.log("Fetched reports:", data); // Log fetched reports
          setReports(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching reports:", err);
      }
    };
    fetchReports();
  }, []);

  // Initialize the map and add markers
  useEffect(() => {
    if (!map.current) {
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [center.lng, center.lat],
        zoom: zoom,
        hash: true,
      });
    }

    // Remove existing markers to avoid duplication
    markers.current.forEach((marker) => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    markers.current = [];

    // Add markers for each report
    if (map.current && reports.length > 0) {
      reports.forEach((report, index) => {
        console.log(`Processing report #${index}:`, report); // Log each report being processed

        if (
          report.latitude !== undefined &&
          report.longitude !== undefined &&
          !isNaN(report.latitude) &&
          !isNaN(report.longitude)
        ) {
          const marker = new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat([report.longitude, report.latitude])
            .addTo(map.current);

          // Open sidebar and set clicked item details on click
          marker.getElement().addEventListener("click", () => {
            console.log("Marker clicked:", report); // Log the clicked marker details
            setClickedItem(report);
            setMapSidebarOpen(true);
          });

          markers.current.push(marker);
        } else {
          console.warn("Invalid report coordinates:", report);
        }
      });
    }
  }, [reports]);

  const handleMapSidebarClose = () => setMapSidebarOpen(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <MapNavbar open={mapSidebarOpen} />
      <MapSidebar
        open={mapSidebarOpen}
        handleDrawerClose={handleMapSidebarClose}
        item={clickedItem}
      />
      <Main open={mapSidebarOpen}>
        <Box className="container">
          <div ref={mapContainer} id="map" className="map" />
        </Box>
      </Main>
    </Box>
  );
}