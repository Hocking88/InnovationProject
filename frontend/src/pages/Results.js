import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  Grid, // Import Grid for layout
  Button // Import Button
} from '@mui/material';
import ResultsChart from '../components/ResultsChart';

export default function Results() {
  const [history, setHistory] = useState([]);

  // Load history from localStorage when the component mounts
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
    setHistory(storedHistory);
  }, []);

  // Function to clear the history
  const handleClearHistory = () => {
    localStorage.removeItem('malwareScanHistory');
    setHistory([]);
  };

  return (
    <Container sx={{ mt: 8, mb: 2 }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Scan Results
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          Clear History
        </Button>
      </Box>

      {/* Check if history is empty */}
      {history.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.paper' }}>
          <Typography variant="h6">No scan history found.</Typography>
          <Typography color="text.secondary">
            Go to the Upload page to scan a file or text.
          </Typography>
        </Paper>
      ) : (
        // If history exists, map over it
        <Grid container spacing={3}>
          {history.map((item) => {
            const statusColor = item.status === 'SAFE' ? 'green' : 'red';
            return (
              <Grid item xs={12} key={item.id}>
                <Paper sx={{ p: 4, backgroundColor: 'background.paper' }}>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: statusColor, fontWeight: 'bold' }}>
                      {item.status} {item.status === 'SAFE' ? '✅' : 'MALICIOUS ❌'}
                    </Typography>
                    
                    <Box sx={{ my: 3 }}>
                      <ResultsChart value={item.score} />
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Our analysis indicates this content is 
                      {item.status === 'SAFE' ? ' safe and free from malware.' : ' potentially malicious.'}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ textAlign: 'left', color: 'text.secondary' }}>
                    <Typography variant="body2" component="div">
                      <strong>Item Analyzed:</strong> {item.type}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      component="div"
                      sx={{ overflowWrap: 'break-word' }}
                    >
                      <strong>Details:</strong> {item.name}
                    </Typography>
                    <Typography variant="body2" component="div">
                      <strong>Scanned on:</strong> {new Date(item.id).toLocaleString()}
                    </Typography>
                  </Box>

                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}