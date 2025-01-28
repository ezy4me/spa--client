// src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
