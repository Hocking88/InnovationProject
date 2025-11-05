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
// Import a more relevant icon
import UploadFileIcon from '@mui/icons-material/UploadFile'; 
import ResultsChart from '../components/ResultsChart';

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
      
      {/* --- THIS BUTTON IS NOW UPDATED --- */}
      <Button 
        component={RouterLink} 
        to="/upload" // 1. Points to /upload
        startIcon={<UploadFileIcon />} // 2. Uses a new icon
        sx={{ mb: 2 }}
        variant="outlined" // 3. Make it stand out a little
      >
        Scan Another File
      </Button>
      {/* --- END OF UPDATE --- */}

      <Paper sx={{ p: 4, backgroundColor: 'background.paper' }}>
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

        <Divider sx={{ mb: 3 }} />

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
      </Paper>
    </Container>
  );
}