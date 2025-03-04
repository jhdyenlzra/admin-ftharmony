import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MapSidebar({ open, handleDrawerClose, item }) {
  const theme = useTheme();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Box sx={{ padding: 2 }}>
        {item ? (
          <>
            <Typography variant="h6">Report Details</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Coordinates"
                  secondary={`${item.latitude}, ${item.longitude}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Abuser Name"
                  secondary={item.abuser_name || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Victim Name"
                  secondary={item.victim_name || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Type of Abuse"
                  secondary={item.type_of_abuse || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Incident Description"
                  secondary={item.incident_description || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Witness Statement"
                  secondary={item.witness_statement || "N/A"}
                />
              </ListItem>
            </List>
          </>
        ) : (
          <Typography variant="body2">Click a marker to view details.</Typography>
        )}
      </Box>
    </Drawer>
  );
}
