import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const { isOpen } = useSidebar();

  const menuItems = [
    { text: "Главная", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { text: "Бронирование", path: "/admin/booking", icon: <BookIcon /> },
    { text: "Оплата", path: "/admin/payment", icon: <PaymentIcon /> },
    { text: "Склад", path: "/admin/inventory", icon: <InventoryIcon /> },
    { text: "Выручка", path: "/admin/revenue", icon: <MonetizationOnIcon /> },
    { text: "Сотрудники", path: "/admin/employees", icon: <PeopleIcon /> },
    {
      text: "Уведомления",
      path: "/admin/notification",
      icon: <NotificationsIcon />,
    },
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
        },
      }}>
      {/* Фикс перекрытия AppBar */}
      <Toolbar />

      <List sx={{ padding: 0 }}>
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
    </Drawer>
  );
};

export default Sidebar;
