import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpaIcon from "@mui/icons-material/Spa";
import LocationOnIcon from "@mui/icons-material/LocationOn";  

import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slice/authSlice";
import { RootState } from "../store/store";

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const allMenuItems = [
    {
      text: "Главная",
      path: "dashboard",
      icon: <DashboardIcon />,
      roles: ["admin", "manager"],
    },
    {
      text: "Бронирование",
      path: "booking",
      icon: <BookIcon />,
      roles: ["admin", "manager"],
    },
    {
      text: "Номера",
      path: "room",
      icon: <SpaIcon />,
      roles: ["admin", "manager"],
    },
    {
      text: "Филиалы",
      path: "location",
      icon: <LocationOnIcon />,
      roles: ["admin", "manager"],
    },
    {
      text: "Клиенты",
      path: "client",
      icon: <PersonIcon />,
      roles: ["admin", "manager"],
    },
    {
      text: "Оплата",
      path: "payment",
      icon: <PaymentIcon />,
      roles: ["admin", "manager"],
    },
    {
      text: "Склад",
      path: "inventory",
      icon: <InventoryIcon />,
      roles: ["admin", "manager"],
    },
    {
      text: "Категории товаров",
      path: "category",
      icon: <CategoryIcon />,
      roles: ["admin", "manager"],
    },
    {
      text: "Выручка",
      path: "revenue",
      icon: <MonetizationOnIcon />,
      roles: ["manager"],
    },
    {
      text: "Сотрудники",
      path: "employees",
      icon: <PeopleIcon />,
      roles: ["manager"],
    },
    {
      text: "Смены",
      path: "shift",
      icon: <AccessTimeIcon />,
      roles: ["admin"],
    },
  ];

  const normalizedRole = userRole ? userRole.toLowerCase() : "";

  const menuItems = allMenuItems
    .filter((item) => item.roles.includes(normalizedRole))
    .map(({ text, path, icon }) => ({
      text,
      path: `/${normalizedRole}/${path}`,
      icon,
    }));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        overflow: "hidden",
        "& .MuiDrawer-paper": {
          width: isOpen ? drawerWidth : collapsedWidth,
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <List sx={{ flexGrow: 1, padding: 0 }}>
        {menuItems.map(({ text, path, icon }) => (
          <ListItemButton
            sx={{
              paddingY: 1.5,
              justifyContent: isOpen ? "initial" : "center",
              whiteSpace: "nowrap",
            }}
            key={path}
            component={Link}
            to={path}>
            <ListItemIcon
              sx={{
                minWidth: 36,
                justifyContent: !isOpen ? "center" : "inherit",
              }}>
              {icon}
            </ListItemIcon>
            {isOpen && <ListItemText primary={text} />}
          </ListItemButton>
        ))}
      </List>

      <Divider />
      <List>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            paddingY: 1.5,
            justifyContent: isOpen ? "initial" : "center",
            whiteSpace: "nowrap",
          }}>
          <ListItemIcon
            sx={{
              justifyContent: !isOpen ? "center" : "inherit",
            }}>
            <ExitToAppIcon color="error" />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Выход" />}
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
