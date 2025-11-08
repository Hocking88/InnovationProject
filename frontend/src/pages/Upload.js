// Upload Page
// This page allows users to upload a file or paste text for malware analysis.
// The uploaded or entered data is processed into feature format and sent to the backend for prediction.
// Results are saved locally and redirected to the Result Detail page.

import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { getFeatures, predictOne } from '../lib/api';

export default function Upload() {
  // --- STATE VARIABLES ---
  const [isLoading, setIsLoading] = useState(false);         // Controls loading spinner visibility
  const [selectedFile, setSelectedFile] = useState(null);    // Stores the uploaded file
  const [textValue, setTextValue] = useState('');            // Stores manually entered text
  const [featureList, setFeatureList] = useState([]);        // Holds list of model feature names
  const fileInputRef = useRef(null);                         // Ref for hidden file input element
  const navigate = useNavigate();                            // Used for page redirection

  // --- FETCH MODEL FEATURES ON LOAD ---
  useEffect(() => {
    getFeatures()
      .then(setFeatureList)
      .catch(() => setFeatureList([])); // Fallback to empty list if backend unavailable
  }, []);

  // --- HANDLE FILE SELECTION ---
  const handleFileSelectClick = () => {
    fileInputRef.current.click(); // Programmatically open file input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setTextValue(''); // Clear text input if file selected
    }
  };

  // --- HANDLE TEXT INPUT ---
  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    if (event.target.value) setSelectedFile(null); // Clear file selection if user types text
  };

  // --- HELPER: READ FILE CONTENT AS TEXT ---
  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsText(file);
    });

  // --- HELPER: PARSE TEXT INTO FEATURES (JSON or key=value format) ---
  const parseTextToFeatures = (text, features) => {
    const base = {};
    features.forEach(f => (base[f] = 0)); // Initialize default feature values

    if (!text || !text.trim()) return base;

    try {
      // Try parsing as JSON first
      const obj = JSON.parse(text);
      features.forEach(f => (base[f] = Number(obj[f] ?? base[f])));
      return base;
    } catch (_) {}

    // If not JSON, try parsing as key=value lines
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    lines.forEach(line => {
      const m = line.split('=');
      if (m.length >= 2) {
        const k = m[0].trim();
        const v = Number(m.slice(1).join('=').trim());
        if (features.includes(k) && !Number.isNaN(v)) base[k] = v;
      }
    });
    return base;
  };

  // --- HELPER: PARSE CSV (first row only) ---
  const parseCsvFirstRow = (csvText, features) => {
    const base = {};
    features.forEach(f => (base[f] = 0));
    const lines = csvText.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return base;

    const header = lines[0].split(',').map(s => s.trim());
    const row = lines[1].split(',').map(s => s.trim());

    header.forEach((h, idx) => {
      if (features.includes(h)) {
        const v = Number(row[idx]);
        if (!Number.isNaN(v)) base[h] = v;
      }
    });
    return base;
  };

  // --- MAIN HANDLER: RUN MALWARE ANALYSIS ---
  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      let featuresObj;

      // Determine which input source to use
      if (textValue) {
        featuresObj = parseTextToFeatures(textValue, featureList);
      } else if (selectedFile) {
        const txt = await readFileAsText(selectedFile);
        featuresObj = parseCsvFirstRow(txt, featureList);
      } else {
        // Default to zero-filled features if no input
        const base = {};
        featureList.forEach(f => (base[f] = 0));
        featuresObj = base;
      }

      // Send parsed data to backend for prediction
      const res = await predictOne(featuresObj);
      const score = Math.round((res.probability ?? 0) * 100);
      const status = res.label === 1 ? 'SAFE' : 'MALICIOUS';

      // Build analysis result object for localStorage
      const analysisDetail = {
        id: new Date().toISOString(),
        type: selectedFile ? 'File' : 'Text',
        name: selectedFile
          ? selectedFile.name
          : textValue
          ? textValue.substring(0, 30) + '...'
          : 'Manual Features',
        score,
        status,
      };

      // Update scan history in localStorage
      const currentHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
      const newHistory = [analysisDetail, ...currentHistory];
      localStorage.setItem('malwareScanHistory', JSON.stringify(newHistory));

      // Navigate to result detail page
      navigate(`/result/${analysisDetail.id}`);
    } catch (e) {
      setIsLoading(false);
      alert('Prediction failed. Ensure backend is running and input matches model features.');
      return;
    }
    setIsLoading(false);
  };

  // --- PAGE LAYOUT ---
  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      
      {/* Hidden file input (triggered by "Select File" button) */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

      {/* Page Title */}
      <Typography variant="h4" gutterBottom>Upload</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        🔒 Your data is processed securely and not stored.
      </Typography>

      {/* --- FILE UPLOAD SECTION --- */}
      <Paper variant="outlined" sx={{ borderStyle: 'dashed', p: 4, mb: 3 }}>
        {selectedFile ? (
          // Display selected file info
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <InsertDriveFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1">{selectedFile.name}</Typography>
          </Box>
        ) : (
          <Typography>Drag & drop CSV row here or Select File</Typography>
        )}

        {/* File select button */}
        <Button variant="contained" sx={{ mt: 2 }} disabled={isLoading} onClick={handleFileSelectClick}>
          Select File
        </Button>
      </Paper>

      {/* --- TEXT INPUT SECTION --- */}
      <Typography variant="subtitle1">
        Or paste features (JSON or key=value per line):
      </Typography>
      <TextField
        multiline
        fullWidth
        minRows={5}
        placeholder='{"Machine":0,"SizeOfOptionalHeader":224,...}  or  Machine=0'
        sx={{ mt: 1, mb: 3 }}
        disabled={isLoading}
        value={textValue}
        onChange={handleTextChange}
      />

      {/* --- ANALYZE BUTTON --- */}
      <Button
        variant="contained"
        sx={{ backgroundColor: '#131414', color: '#F9F7F0', width: 150, height: 40 }}
        onClick={handleAnalyze}
        disabled={isLoading || (!selectedFile && !textValue && featureList.length === 0)}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: '#F9F7F0' }} />
        ) : (
          'ANALYSE'
        )}
      </Button>
    </Container>
  );
}
