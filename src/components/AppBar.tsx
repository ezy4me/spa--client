import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSidebar } from "../contexts/SidebarContext";
import UserInfo from "./UI/UserInfo";

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
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Панель управления
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <UserInfo /> 
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
