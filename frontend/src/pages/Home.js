// Home Page
// Import necessary components from React and Material-UI (MUI)
import React from 'react';
import { Typography, Button, Box } from '@mui/material'; 
// Import the useNavigate hook from react-router-dom to handle navigation
import { useNavigate } from 'react-router-dom';
// Import a specific icon from the MUI icons library
import SecurityIcon from '@mui/icons-material/Security'; // A fitting icon

// Define the Home component
export default function Home() {
  // Initialize the navigate function from the useNavigate hook
  const navigate = useNavigate();

  return (
    // Use Box component as the main container
    // The sx prop allows for custom styling and theme access
    <Box
      sx={{
        display: 'flex', // Use flexbox for layout
        flexDirection: 'column', // Stack children vertically
        alignItems: 'center', // Center children horizontally
        justifyContent: 'center', // Center children vertically
        flexGrow: 1, // Allow this box to grow and fill available vertical space
        mt: 20, // Margin-top (20 units = 160px)
        mb: 8, // Margin-bottom for spacing (e.g., from a footer)
        textAlign: 'center', // Ensure text inside is centered
        px: 3, // Horizontal padding (left and right)
      }}
    >
      {/* 1. Add an Icon */}
      <SecurityIcon 
        sx={{ 
          fontSize: 60, // Make the icon larger
          color: 'primary.main', // Use the theme's primary color
          mb: 2 // Margin-bottom (2 units = 16px)
        }} 
      />

      {/* 2. Refine Typography for the main title */}
      <Typography 
        variant="h3" // Set the text style (size, weight)
        component="h1" // Render as an h1 tag for semantic HTML (good for SEO)
        gutterBottom // Add standard bottom margin
        sx={{ fontWeight: 'bold' }} // Make the font bold
      >
        Malware Detection
      </Typography>
      
      {/* Subtitle text */}
      <Typography 
        variant="h6" // Smaller text style than the title
        color="text.secondary" // Use a softer, secondary text color from the theme
        sx={{ mb: 4 }} // Margin-bottom (4 units = 32px)
      >
        Upload your file or paste a message to check for malware threats.
      </Typography>

      {/* 3. Refine Button for the main call-to-action */}
      <Button
        variant="contained" // Use a filled button style
        size="large" // Make the button larger (padding, font size)
        sx={{ 
          backgroundColor: '#131414', // Custom background color
          color: '#F9F7F0', // Custom text color
          px: 5, // Horizontal padding
          py: 1.5, // Vertical padding
          borderRadius: 8, // Custom border radius (more rounded)
          fontWeight: 'bold', // Bold text
          // Define hover effect using the '&:hover' pseudo-selector
          '&:hover': {
            backgroundColor: '#333' // Darker gray on hover
          }
        }}
        // Set the onClick event handler to navigate to the '/upload' route
        onClick={() => navigate('/upload')}
      >
        START SCAN
      </Button>
    </Box>
  );
}