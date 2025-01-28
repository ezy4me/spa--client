// src/components/Sidebar.tsx
import React from 'react';
import { List, ListItem, ListItemText, Drawer, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/bookings">
          <ListItemText primary="Bookings" />
        </ListItem>
        <ListItem button component={Link} to="/revenue">
          <ListItemText primary="Revenue" />
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;
