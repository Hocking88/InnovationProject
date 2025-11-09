//Results Page
// This page displays the results of malware scans, including charts and detailed cards.
// It retrieves scan history from localStorage and allows users to clear their history.
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
  // --- STATE MANAGEMENT ---
  // 'history' stores past scan results retrieved from localStorage
  const [history, setHistory] = useState([]);
  // --- LOAD SCAN HISTORY ON PAGE LOAD ---
  useEffect(() => {
    // Retrieve saved scan history from localStorage or use an empty array if none exists
    const storedHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
    setHistory(storedHistory);
  }, []);
  // --- CLEAR HISTORY FUNCTION ---
  // Clears scan history from both state and localStorage
  const handleClearHistory = () => {
    localStorage.removeItem('malwareScanHistory');
    setHistory([]);
  };

  return (
    <Container sx={{ mt: 8, mb: 2 }}>
      {/* --- HEADER SECTION --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Scan Results
        </Typography>
        {/* Clear history button (disabled if no history) */}
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleClearHistory}
          disabled={history.length === 0}
        >
          Clear History
        </Button>
      </Box>

      {/* --- DASHBOARD SECTION (Summary Charts) --- */}
      {history.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            History Dashboard
          </Typography>
          
          {/* Layout container for charts */}
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

      {/* --- INDIVIDUAL SCAN DETAILS SECTION --- */}
      {history.length > 0 && (
        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
          Individual Scan Details
        </Typography>
      )}
      {/* --- EMPTY STATE (No History Found) --- */}
      {history.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'background.paper' }}>
          <Typography variant="h6">No scan history found.</Typography>
          <Typography color="text.secondary">
            Go to the Upload page to scan a file or text.
          </Typography>
        </Paper>
      ) : (
        // --- INDIVIDUAL CARDS LAYOUT ---
        //Displays each scan result in a responsive grid layout
        <Grid container spacing={3}>
          {history.map((item) => {
            const statusColor = item.status === 'SAFE' ? 'green' : 'red';
            return (
              // Responsive grid: 1 column (xs), 2 columns (sm), 3 columns (lg)
              // This item will now be:
              // - 1 column on extra-small screens (xs={12})
              // - 2 columns on small screens (sm={6})
              // - 3 columns on large screens (lg={4})
              <Grid item xs={12} sm={4} md={4} lg={4} key={item.id}>
                <Paper sx={{ p: 4, backgroundColor: 'background.paper' }}>
                  {/* --- SCAN STATUS AND RESULT --- */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: statusColor, fontWeight: 'bold' }}>
                      {item.status === 'SAFE' ? 'SAFE ✅' : 'MALICIOUS ❌'}
                    </Typography>
                    {/* Score visualization chart */}
                    <Box sx={{ my: 3 }}>
                      <ResultsChart value={item.score} status={item.status} />
                    </Box>
                    {/* Short descriptive message */}
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Our analysis indicates this content is 
                      {item.status === 'SAFE' ? ' safe and free from malware.' : ' potentially malicious.'}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />
                  {/* --- DETAILED INFORMATION --- */}
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