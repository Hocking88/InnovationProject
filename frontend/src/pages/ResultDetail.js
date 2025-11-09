// ResultDetail.js
// Displays detailed information for a single scan result.

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Container, Typography, Paper, Box, Divider, Button, CircularProgress 
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile'; 
import ResultsChart from '../components/ResultsChart';
import ExportButton from '../components/ExportButton'; 

export default function ResultDetail() {
  const { resultId } = useParams(); 
  const [result, setResult] = useState(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
    const foundResult = storedHistory.find(item => item.id === resultId);
    setResult(foundResult);
  }, [resultId]);

  if (!result) {
    return (
      <Container sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading result...</Typography>
      </Container>
    );
  }

  const statusColor = result.status === 'SAFE' ? 'green' : 'red';

  return (
    <Container sx={{ mt: 8, mb: 2 }}>
      
      {/* Navigation back to upload */}
      <Button 
        component={RouterLink} 
        to="/upload"
        startIcon={<UploadFileIcon />}
        sx={{ mb: 2 }}
        variant="outlined"
      >
        Scan Another File
      </Button>

      <Paper 
        id="malware-report-area"  /* <<< ID MOVED HERE */
        sx={{ p: 4, backgroundColor: 'background.paper' }}
      >
        {/* --- RESULT STATUS & SCORE --- */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: statusColor, fontWeight: 'bold' }}>
            {result.status === 'SAFE' ? 'SAFE ✅' : 'MALICIOUS ❌'}
          </Typography>

          <Box sx={{ my: 3 }}>
            {/* The chart is now INSIDE the capture area */}
            <ResultsChart value={result.score} status={result.status} />
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Our analysis indicates this content is 
            {result.status === 'SAFE' ? ' safe and free from malware.' : ' potentially malicious.'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* --- DETAILED INFO & EXPORT --- */}
        <Box 
          /* <<< ID REMOVED FROM HERE */
          sx={{ textAlign: 'left', color: 'text.secondary' }}
        >
          <Typography variant="body2" component="div">
            <strong>Item Analyzed:</strong> {result.type}
          </Typography>
          <Typography variant="body2" component="div" sx={{ overflowWrap: 'break-word' }}>
            <strong>Details:</strong> {result.name}
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Scanned on:</strong> {new Date(result.id).toLocaleString()}
          </Typography>
        </Box>
      </Paper>
      <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ExportButton
          wrapperId="malware-report-area"
          status={result.status}
          filenameBase={`malware_report_${result.id}`}
          alwaysEnable={true}
        />
      </Box>

    </Container>
  );
}
