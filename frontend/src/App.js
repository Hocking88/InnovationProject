//App.js
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Results from './pages/Results';
import ResultDetail from './pages/ResultDetail';
import HowItWorks from './pages/HowItWorks';
import Security from './pages/Security';
import About from './pages/About';

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Upload', to: '/upload' },
    { label: 'Results', to: '/results' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Security & Privacy', to: '/security' },
    { label: 'About', to: '/about' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F9F7F0',
      }}
    >
      {/* ---- NAVBAR ---- */}
      <AppBar position="static" sx={{ backgroundColor: '#F9C54D', color: '#131414' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, fontWeight: 'bold' }}>SE04GRP8</Box>

          {/* Hamburger for mobile */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop buttons */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            {navItems.map(item => (
              <Button key={item.to} component={Link} to={item.to} color="inherit">
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            {navItems.map(item => (
              <ListItem key={item.to} disablePadding>
                <ListItemButton component={Link} to={item.to}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* ---- MAIN CONTENT ---- */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results" element={<Results />} />
          <Route path="/result/:resultId" element={<ResultDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/security" element={<Security />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>

      {/* ---- FOOTER ---- */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 2,
          backgroundColor: '#F8EDD3',
          color: '#131414',
          mt: 'auto',
        }}
      >
        © 2025 Malware Detection | All rights reserved
      </Box>
    </Box>
  );
}

