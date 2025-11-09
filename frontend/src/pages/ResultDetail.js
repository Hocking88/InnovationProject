// ResultDetail.js
// This page displays detailed information for a single scan result.
// It retrieves the result data from localStorage based on the resultId from the URL.

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  Button,
  CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile'; 
import ResultsChart from '../components/ResultsChart';
import ExportButton from '../components/ExportButton'; 

export default function ResultDetail() {
  // --- GET PARAMETER FROM URL ---
  // Extract the "resultId" from the URL (e.g., /result/:resultId)
  const { resultId } = useParams(); 

  // --- STATE MANAGEMENT ---
  // 'result' stores the individual scan result found in localStorage
  const [result, setResult] = useState(null);

  // --- LOAD INDIVIDUAL RESULT ON COMPONENT MOUNT ---
  useEffect(() => {
    // Retrieve stored scan history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
    
    // Find the result that matches the current resultId
    const foundResult = storedHistory.find(item => item.id === resultId);
    
    // Store the found result in state
    setResult(foundResult);
  }, [resultId]);

  // --- LOADING STATE ---
  // Display a loading spinner while the result is being retrieved
  if (!result) {
    return (
      <Container sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading result...</Typography>
      </Container>
    );
  }

  // --- SET COLOR BASED ON SCAN STATUS ---
  const statusColor = result.status === 'SAFE' ? 'green' : 'red';

  return (
    <Container sx={{ mt: 8, mb: 2 }}>
      
      {/* --- NAVIGATION BUTTON --- */}
      {/* Provides a link back to the upload page to allow another scan */}
      <Button 
        component={RouterLink} 
        to="/upload"
        startIcon={<UploadFileIcon />} 
      <Button 
        component={RouterLink} 
        to="/upload"
        startIcon={<UploadFileIcon />}
        sx={{ mb: 2 }}
        variant="outlined"
      >
        Scan Another File
      </Button>

      {/* --- RESULT DETAIL CARD --- */}
      <Paper sx={{ p: 4, backgroundColor: 'background.paper' }}>
        
        {/* --- RESULT STATUS AND SCORE --- */}
        <Box sx={{ textAlign: 'center' }}>
          {/* Display scan status: SAFE or MALICIOUS */}
          <Typography variant="h5" sx={{ color: statusColor, fontWeight: 'bold' }}>
            {result.status === 'SAFE' ? 'SAFE ✅' : 'MALICIOUS ❌'}
          </Typography>
          
          {/* Visual representation of scan confidence score */}
          <Box sx={{ my: 3 }}>
            <ResultsChart value={result.score} status={result.status} />
          </Box>
          
          {/* Short summary text describing the result */}
          <Typography variant="body1" sx={{ mb: 3 }}>
            Our analysis indicates this content is 
            {result.status === 'SAFE' ? ' safe and free from malware.' : ' potentially malicious.'}
          </Typography>
        </Box>
        {/* Everything inside this wrapper will be exported */}
        <Box id="malware-report-area">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: statusColor, fontWeight: 'bold' }}>
              {result.status === 'SAFE' ? 'SAFE ✅' : 'MALICIOUS ❌'}
            </Typography>

            <Box sx={{ my: 3 }}>
              <ResultsChart value={result.score} status={result.status} />
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Our analysis indicates this content is 
              {result.status === 'SAFE' ? ' safe and free from malware.' : ' potentially malicious.'}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'left', color: 'text.secondary' }}>
            <Typography variant="body2" component="div">
              <strong>Item Analyzed:</strong> {result.type}
            </Typography>
            <Typography 
              variant="body2" 
              component="div"
              sx={{ overflowWrap: 'break-word' }}
            >
              <strong>Details:</strong> {result.name}
            </Typography>
            <Typography variant="body2" component="div">
              <strong>Scanned on:</strong> {new Date(result.id).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* --- RESULT DETAILS SECTION --- */}
        {/* Displays metadata such as file type, name, and scan time */}
        <Box sx={{ textAlign: 'left', color: 'text.secondary' }}>
          <Typography variant="body2" component="div">
            <strong>Item Analyzed:</strong> {result.type}
          </Typography>
          <Typography 
            variant="body2" 
            component="div"
            sx={{ overflowWrap: 'break-word' }}
          >
            <strong>Details:</strong> {result.name}
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Scanned on:</strong> {new Date(result.id).toLocaleString()}
          </Typography>
        {/* Export buttons (disabled unless MALICIOUS) */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <ExportButton
            wrapperId="malware-report-area"
            status={result.status}
            filenameBase={`malware_charts_${result.id}`}
          />
        </Box>
      </Paper>
    </Container>
  );
}
