import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const MapNavbar = ({ open }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/home"); // Adjust the path to match your home route
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: open ? "margin 0.3s ease-out" : "margin 0.3s ease-in",
        marginLeft: open ? "240px" : "0",
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="back"
          onClick={handleBackClick}
          sx={{ marginRight: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Map View
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MapNavbar;
