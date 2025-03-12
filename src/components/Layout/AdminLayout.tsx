import React, { ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";
import { SidebarProvider, useSidebar } from "../../contexts/SidebarContext";
import AppBar from "../AppBar";
import Sidebar from "../Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

const MainContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen } = useSidebar();
  const sidebarWidth = isOpen ? 240 : 60; 

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: .5,
        width: `calc(100vw - ${sidebarWidth}px)`, 
        height: 'calc(100vh - 128px)',
        transition: "width 0.3s ease-in-out",
        overflow: "hidden", 
      }}>
      {children}
    </Box>
  );
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <Box sx={{ display: "flex", overflow: "hidden" }}>
        <CssBaseline />
        <AppBar />
        <Sidebar />
        <MainContent>{children}</MainContent>
      </Box>
    </SidebarProvider>
  );
};

export default AdminLayout;
