import React, { ReactNode } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { SidebarProvider, useSidebar } from '../../contexts/SidebarContext';
import AppBar from '../AppBar';
import Sidebar from '../Sidebar';

const drawerWidth = 240;

interface AdminLayoutProps {
  children: ReactNode;
}

const MainContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        transition: 'margin 0.3s ease-in-out',
        marginLeft: isOpen ? `${drawerWidth}px` : '0',
      }}
    >
      <Toolbar />
      {children}
    </Box>
  );
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar />
        <Sidebar />
        <MainContent>{children}</MainContent>
      </Box>
    </SidebarProvider>
  );
};

export default AdminLayout;
