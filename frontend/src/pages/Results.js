import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Grid,
  Button
} from '@mui/material';
import ResultsChart from '../components/ResultsChart';
import ScanOutcomesPie from '../components/charts/ScanOutcomesPie';
import ScanTypesBar from '../components/charts/ScanTypesBar';
import ScansOverTimeLine from '../components/charts/ScansOverTimeLine';

export default function Results() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
    setHistory(storedHistory);
  }, []);

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

      {/* --- DASHBOARD SECTION --- */}
      {history.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            History Dashboard
          </Typography>
          
          {/* --- THIS IS THE UPDATED GRID --- */}
          <Grid container spacing={3}>
            {/* Pie Chart (1/3 width) */}
            <Grid item xs={12} md={4}>
              {/* We give the Paper a fixed height */}
              <Paper sx={{ p: 2, height: '350px' }}>
                <ScanOutcomesPie history={history} />
              </Paper>
            </Grid>
            
            {/* Bar Chart (2/3 width) */}
            <Grid item xs={12} md={8}>
              {/* We give the Paper a fixed height */}
              <Paper sx={{ p: 2, height: '350px' }}>
                <ScanTypesBar history={history} />
              </Paper>
            </Grid>
            
            {/* Line Chart (full width) */}
            <Grid item xs={12}>
              {/* We give the Paper a fixed height */}
              <Paper sx={{ p: 2, height: '350px' }}>
                <ScansOverTimeLine history={history} />
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* --- INDIVIDUAL DETAILS SECTION --- */}
      {history.length > 0 && (
        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Individual Scan Details
        </Typography>
      )}

      {history.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.paper' }}>
          <Typography variant="h6">No scan history found.</Typography>
          <Typography color="text.secondary">
            Go to the Upload page to scan a file or text.
          </Typography>
        </Paper>
      ) : (
        // --- CHANGE 2: INDIVIDUAL CARDS LAYOUT ---
        // We'll add 'sm' and 'lg' props to make this a multi-column grid
        <Grid container spacing={3}>
          {history.map((item) => {
            const statusColor = item.status === 'SAFE' ? 'green' : 'red';
            return (
              // This item will now be:
              // - 1 column on extra-small screens (xs={12})
              // - 2 columns on small screens (sm={6})
              // - 3 columns on large screens (lg={4})
              <Grid item xs={12} sm={4} md={4} lg={4} key={item.id}>
                <Paper sx={{ p: 4, backgroundColor: 'background.paper' }}>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: statusColor, fontWeight: 'bold' }}>
                      {item.status === 'SAFE' ? 'SAFE ✅' : 'MALICIOUS ❌'}
                    </Typography>
                    
                    <Box sx={{ my: 3 }}>
                      <ResultsChart value={item.score} status={item.status} />
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