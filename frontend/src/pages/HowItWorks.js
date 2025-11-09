//HowItWorks Page
// Import necessary components from React and Material--UI (MUI)
import React from 'react';
import { 
  Container,    // Centers content horizontally and adds padding
  Typography,   // For rendering text with predefined styles
  Box,          // A generic container component, often used for layout
  Paper         // A component that renders with a Material-UI paper/elevation style (like a card)
} from '@mui/material';

// Define the HowItWorks component
export default function HowItWorks() {
  return (
    // Container component sets max-width and centers content.
    // sx prop adds custom styling: mt = margin-top, mb = margin-bottom (8 units = 64px by default)
    <Container sx={{ mt: 8, mb: 8 }}>
      {/* Title for the page */}
      <Typography variant="h4" gutterBottom>⚙️ How It Works</Typography>
      
      {/* Paper component wraps the main content, giving it a distinct background and shadow */}
      <Paper sx={{ 
        p: 4, // Padding (4 units = 32px) on all sides
        mt: 4, // Margin-top
        backgroundColor: 'background.paper' // Use the theme's paper color
      }}>
        
        {/* Step 1: Box component to group the heading and body text */}
        <Box sx={{ mb: 3 }}> {/* mb = margin-bottom (3 units = 24px) */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Step 1 – Upload or Paste Your Content
          </Typography>
          <Typography variant="body1">
            Choose a file to upload or paste text (such as an email or message).
          </Typography>
        </Box>
        
        {/* Step 2: Box component */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Step 2 – Smart Feature Extraction
          </Typography>
          <Typography variant="body1">
            Our system looks at file properties (size, type, metadata) or text patterns (keywords, suspicious structures) that might indicate malware.
          </Typography>
        </Box>
        
        {/* Step 3: Box component */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Step 3 – AI Classification
          </Typography>
          <Typography variant="body1">
            A trained AI model compares the extracted features with known patterns of safe and harmful content.
          </Typography>
        </Box>
        
        {/* Step 4: Box component (no margin-bottom as it's the last step) */}
        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Step 4 – Results in Seconds
          </Typography>
          <Typography variant="body1">
            The system tells you whether your file or message is “Safe” or “Potentially Malicious,” along with a confidence score (e.g., 87% likely malicious).
          </Typography>
        </Box>
        
        {/* Concluding summary text */}
        <Typography variant="body1" sx={{ mt: 4 }}> {/* mt = margin-top */}
          👉 We designed this process to be fast, simple, and transparent—so you can quickly check suspicious content without needing technical expertise.
        </Typography>

      </Paper>
    </Container>
  );
}