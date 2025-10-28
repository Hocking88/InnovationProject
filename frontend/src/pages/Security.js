import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function Security() {
  return (
    <Container sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" gutterBottom>🔒 Security & Privacy</Typography>
      
      <Paper sx={{ p: 4, mt: 4, backgroundColor: 'background.paper' }}>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            No Data Storage:
          </Typography>
          <Typography variant="body1">
            Your files, messages, and emails are only processed temporarily for analysis and deleted immediately afterward.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Secure Transmission:
          </Typography>
          <Typography variant="body1">
            All uploads and text inputs are protected using HTTPS encryption to prevent unauthorized access.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Private by Design:
          </Typography>
          <Typography variant="body1">
            No personal or confidential data is saved, shared, or reused in any way.
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Trust & Transparency:
          </Typography>
          <Typography variant="body1">
            Our focus is to provide peace of mind while keeping your information secure.
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 4 }}>
          👉 In short: your data stays private, safe, and under your control.
        </Typography>

      </Paper> 
    </Container>
  );
}