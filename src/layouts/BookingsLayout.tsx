// src/layouts/BookingsLayout.tsx
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const BookingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          paddingTop: '64px',
          paddingLeft: '20px',
        }}
      >
        <Header />
        <Box sx={{ marginTop: '80px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default BookingsLayout;
