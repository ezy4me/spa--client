// src/components/Layout/Layout.tsx
import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

// Используем makeStyles для стилизации
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 240,
      boxSizing: 'border-box',
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1, // Для того, чтобы AppBar был поверх Drawer
  },
  container: {
    marginTop: theme.spacing(3),
  },
  content: {
    display: 'flex',
    flexGrow: 1,
  },
}));

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const classes = useStyles();

  return (
    <div style={{ display: 'flex' }}>
      <Drawer className={classes.drawer} variant="permanent">
        <List>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Главная" />
          </ListItem>
          <ListItem button component={Link} to="/bookings">
            <ListItemText primary="Бронирования" />
          </ListItem>
          <ListItem button component={Link} to="/stock">
            <ListItemText primary="Склад" />
          </ListItem>
          <ListItem button component={Link} to="/revenue">
            <ListItemText primary="Выручка" />
          </ListItem>
          <ListItem button component={Link} to="/notifications">
            <ListItemText primary="Уведомления" />
          </ListItem>
          <ListItem button component={Link} to="/employees">
            <ListItemText primary="Сотрудники" />
          </ListItem>
          <ListItem button component={Link} to="/admin">
            <ListItemText primary="Администрирование" />
          </ListItem>
        </List>
      </Drawer>

      <div className={classes.content}>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6">Система управления Спа-Салонами</Typography>
          </Toolbar>
        </AppBar>

        <Container className={classes.container}>
          {children}
        </Container>
      </div>
    </div>
  );
};

export default Layout;
