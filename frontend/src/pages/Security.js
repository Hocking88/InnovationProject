// Security Page
// This page provides information about the application's privacy and security practices.
// It emphasizes that user data is not stored, shared, or reused in any way.

import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function Security() {
  return (
    // --- MAIN PAGE CONTAINER ---
    // Adds top and bottom margins to position content nicely within the layout
    <Container sx={{ mt: 8, mb: 8 }}>
      
      {/* --- PAGE TITLE --- */}
      <Typography variant="h4" gutterBottom>🔒 Security & Privacy</Typography>
      
      {/* --- SECURITY INFORMATION CARD --- */}
      {/* Displays key points about how the app handles data and privacy */}
      <Paper sx={{ p: 4, mt: 4, backgroundColor: 'background.paper' }}>
        
        {/* --- SECTION 1: NO DATA STORAGE --- */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            No Data Storage:
          </Typography>
          <Typography variant="body1">
            Your files, messages, and emails are only processed temporarily for analysis and deleted immediately afterward.
          </Typography>
        </Box>
        
        {/* --- SECTION 2: SECURE TRANSMISSION --- */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Secure Transmission:
          </Typography>
          <Typography variant="body1">
            All uploads and text inputs are protected using HTTPS encryption to prevent unauthorized access.
          </Typography>
        </Box>
        
        {/* --- SECTION 3: PRIVATE BY DESIGN --- */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Private by Design:
          </Typography>
          <Typography variant="body1">
            No personal or confidential data is saved, shared, or reused in any way.
          </Typography>
        </Box>
        
        {/* --- SECTION 4: TRUST & TRANSPARENCY --- */}
        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Trust & Transparency:
          </Typography>
          <Typography variant="body1">
            Our focus is to provide peace of mind while keeping your information secure.
          </Typography>
        </Box>
        
        {/* --- CONCLUSION MESSAGE --- */}
        <Typography variant="body1" sx={{ mt: 4 }}>
          👉 In short: your data stays private, safe, and under your control.
        </Typography>

      </Paper> 
    </Container>
  );
}
