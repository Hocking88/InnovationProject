import React from 'react';
import { Typography, Button, Box } from '@mui/material'; // Removed Container & Paper
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security'; // A fitting icon

export default function Home() {
  const navigate = useNavigate();

  return (
    // Use Box with flex for vertical centering
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1, 
        mt: 20, 
        mb: 8, // Added margin-bottom for footer spacing
        textAlign: 'center',
        px: 3, // Add some horizontal padding
      }}
    >
      {/* 1. Add an Icon */}
      <SecurityIcon 
        sx={{ 
          fontSize: 60, 
          color: 'primary.main', // Use theme color
          mb: 2 
        }} 
      />

      {/* 2. Refine Typography */}
      <Typography 
        variant="h3" 
        component="h1"
        gutterBottom 
        sx={{ fontWeight: 'bold' }}
      >
        Malware Detection
      </Typography>
      
      <Typography 
        variant="h6" 
        color="text.secondary" // Softer color for subtitle
        sx={{ mb: 4}} 
      >
        Upload your file or paste a message to check for malware threats.
      </Typography>

      {/* 3. Refine Button */}
      <Button
        variant="contained"
        size="large" // Make the button bigger
        sx={{ 
          backgroundColor: '#131414', 
          color: '#F9F7F0', 
          px: 5, // A bit more padding
          py: 1.5, 
          borderRadius: 8,
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#333' // Add a hover effect
          }
        }}
        onClick={() => navigate('/upload')}
      >
        START SCAN
      </Button>
    </Box>
  );
}