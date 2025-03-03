import React from 'react';
import '@maptiler/sdk'; // Import MapTiler SDK
import './analytics.scss'; // Import your custom styles
import Map from "../../components/map/Map";
import "../../components/map/map.scss";

const Analytics = () => {
    return (
      <div style={{ height: "100vh", width: "100%" }}>
        <Map />
      </div>
    );
  };
  
  export default Analytics;