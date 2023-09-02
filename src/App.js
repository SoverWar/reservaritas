import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CssBaseline, Drawer, AppBar, Toolbar, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, ThemeProvider, createTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventIcon from '@mui/icons-material/Event';
import UserRegistrationDialog from './Registro/UserRegistrationDialog';
import UserList from './Registro/UserList';
import Reservations from './Plano/Reservations';
import ReservasMesa from './Reservas/ReservasMesa';



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openCreateUserDialog, setOpenCreateUserDialog] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleOpenCreateUserDialog = () => {
    setOpenCreateUserDialog(true);
  };

  const handleCloseCreateUserDialog = () => {
    setOpenCreateUserDialog(false);
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <ThemeProvider theme={darkTheme}>
      <Router>
        <div style={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Mi Dashboard
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="persistent" open={openDrawer}>
            <div>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <List>
              <ListItem button component={Link} to="/userlist">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button onClick={handleOpenCreateUserDialog}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary="Crear Usuario" />
              </ListItem>
              <ListItem button component={Link} to="/reservas">
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Reservas" />
              </ListItem>
              <ListItem button component={Link} to="/reservamesa">
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Reservas Mesa" />
              </ListItem>
            </List>
          </Drawer>
          <main style={{ flexGrow: 1, padding: '20px', backgroundColor: darkTheme.palette.background.default, minHeight: '100vh' }}>
            <Routes>
              <Route path="/userlist" element={<UserList />} />
              <Route path="/reservas" element={<Reservations />} />
              <Route path="/reservamesa" element={<ReservasMesa />} />
              
                      </Routes>
          </main>
          <UserRegistrationDialog open={openCreateUserDialog} onClose={handleCloseCreateUserDialog} />
        </div>
      </Router>
    </ThemeProvider>
    </DndProvider>
  );
}

export default App;
