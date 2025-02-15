import React, { ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";
import { SidebarProvider } from "../../contexts/SidebarContext";
import AppBar from "../AppBar";
import Sidebar from "../Sidebar";

interface ManagerLayoutProps {
  children: ReactNode;
}

const MainContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: "100%",
        height: "calc(100vh - 128px)",
        transition: "margin 0.3s ease-in-out",
      }}>
      {children}
    </Box>
  );
};

const ManagerLayout: React.FC<ManagerLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar />
        <Sidebar />
        <MainContent>{children}</MainContent>
      </Box>
    </SidebarProvider>
  );
};

export default ManagerLayout;
