import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slice/authSlice";
import { RootState } from "../store/store";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Меню в зависимости от роли пользователя
  const menuItems = [
    { text: "Главная", path: `/${userRole?.toLowerCase()}/dashboard`, icon: <DashboardIcon /> },
    { text: "Бронирование", path: `/${userRole?.toLowerCase()}/booking`, icon: <BookIcon /> },
    { text: "Клиенты", path: `/${userRole?.toLowerCase()}/client`, icon: <PersonIcon /> },
    { text: "Оплата", path: `/${userRole?.toLowerCase()}/payment`, icon: <PaymentIcon /> },
    { text: "Склад", path: `/${userRole?.toLowerCase()}/inventory`, icon: <InventoryIcon /> },
    { text: "Выручка", path: `/${userRole?.toLowerCase()}/revenue`, icon: <MonetizationOnIcon /> },
    { text: "Сотрудники", path: `/${userRole?.toLowerCase()}/employees`, icon: <PeopleIcon /> },
    { text: "Уведомления", path: `/${userRole?.toLowerCase()}/notification`, icon: <NotificationsIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: isOpen ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : 0,
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}>
      <Toolbar />

      <List sx={{ flexGrow: 1, padding: 0 }}>
        {menuItems.map(({ text, path, icon }) => (
          <ListItemButton
            sx={{ paddingY: 1.5 }}
            key={path}
            component={Link}
            to={path}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>

      <Divider />
      <List>
        <ListItemButton onClick={handleLogout} sx={{ paddingY: 1.5 }}>
          <ListItemIcon>
            <ExitToAppIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Выход" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
