import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Results from './pages/Results';
import ResultDetail from './pages/ResultDetail'; 
import HowItWorks from './pages/HowItWorks';
import Security from './pages/Security';
import About from './pages/About';

export default function App() {
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
          <Button component={Link} to="/" color="inherit">Home</Button>
          <Button component={Link} to="/upload" color="inherit">Upload</Button>
          <Button component={Link} to="/results" color="inherit">Results</Button>
          <Button component={Link} to="/how-it-works" color="inherit">How It Works</Button>
          <Button component={Link} to="/security" color="inherit">Security & Privacy</Button>
          <Button component={Link} to="/about" color="inherit">About</Button>
        </Toolbar>
      </AppBar>

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