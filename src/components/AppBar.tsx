import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSidebar } from "../contexts/SidebarContext";

const AppBar: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <MuiAppBar position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <IconButton
          sx={{ marginRight: 1 }}
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Панель управления
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
