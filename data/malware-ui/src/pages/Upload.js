
import React, { useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textValue, setTextValue] = useState("");
  const fileInputRef = useRef(null); 
  const navigate = useNavigate();

  const handleAnalyze = () => {
    setIsLoading(true);

    const analysisDetail = {
      id: new Date().toISOString(), 
      type: selectedFile ? 'File' : 'Text',
      name: selectedFile ? selectedFile.name : (textValue.substring(0, 30) + '...'),
      score: 97, 
      status: 'SAFE' 
    };

    const currentHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
    const newHistory = [analysisDetail, ...currentHistory];
    localStorage.setItem('malwareScanHistory', JSON.stringify(newHistory));

    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate to the new detail page with the specific ID
      navigate(`/result/${analysisDetail.id}`); 
      
    }, 1500); 
  };

  const handleFileSelectClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setTextValue(""); 
    }
  };
  
  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    if (event.target.value) {
      setSelectedFile(null); 
    }
  };

  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Typography variant="h4" gutterBottom>Upload</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        🔒 Your data is processed securely and not stored.
      </Typography>

      <Paper variant="outlined" sx={{ borderStyle: 'dashed', p: 4, mb: 3 }}>
        
        {selectedFile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <InsertDriveFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1">{selectedFile.name}</Typography>
          </Box>
        ) : (
          <Typography>Drag & drop file here</Typography>
        )}
        
        <Button 
          variant="contained" 
          sx={{ mt: 2 }} 
          disabled={isLoading}
          onClick={handleFileSelectClick} 
        >
          Select File
        </Button>
      </Paper>

      <Typography variant="subtitle1">Or paste email/text below:</Typography>
      <TextField
        multiline
        fullWidth
        minRows={5}
        placeholder="Paste the email/text into this box"
        sx={{ mt: 1, mb: 3 }}
        disabled={isLoading}
        value={textValue} 
        onChange={handleTextChange} 
      />
      
      <Button 
        variant="contained" 
        sx={{ 
          backgroundColor: '#131414', 
          color: '#F9F7F0',
          width: 150, 
          height: 40  
        }}
        onClick={handleAnalyze}
        disabled={isLoading || (!selectedFile && !textValue)} 
      >
        {isLoading ? <CircularProgress size={24} sx={{ color: '#F9F7F0' }} /> : 'ANALYZE'}
      </Button>
    </Container>
  );
}