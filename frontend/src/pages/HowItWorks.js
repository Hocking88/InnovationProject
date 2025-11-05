import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function HowItWorks() {
  return (
    <Container sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" gutterBottom>⚙️ How It Works</Typography>
      
      <Paper sx={{ p: 4, mt: 4, backgroundColor: 'background.paper' }}>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Step 1 – Upload or Paste Your Content
          </Typography>
          <Typography variant="body1">
            Choose a file to upload or paste text (such as an email or message).
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Step 2 – Smart Feature Extraction
          </Typography>
          <Typography variant="body1">
            Our system looks at file properties (size, type, metadata) or text patterns (keywords, suspicious structures) that might indicate malware.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Step 3 – AI Classification
          </Typography>
          <Typography variant="body1">
            A trained AI model compares the extracted features with known patterns of safe and harmful content.
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Step 4 – Results in Seconds
          </Typography>
          <Typography variant="body1">
            The system tells you whether your file or message is “Safe” or “Potentially Malicious,” along with a confidence score (e.g., 87% likely malicious).
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 4 }}>
          👉 We designed this process to be fast, simple, and transparent—so you can quickly check suspicious content without needing technical expertise.
        </Typography>

      </Paper>
    </Container>
  );
}