// Upload Page
// This page allows users to upload a file or paste text for malware analysis.
// The uploaded or entered data is processed into feature format and sent to the backend for prediction.
// Results are saved locally and redirected to the Result Detail page.

import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Button, TextField, Paper, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails, Grid, InputAdornment, IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';
import { getFeatures, predictOne } from '../lib/api';

export default function Upload() {
  // --- STATE VARIABLES ---
  const [isLoading, setIsLoading] = useState(false);         // Controls loading spinner visibility
  const [selectedFile, setSelectedFile] = useState(null);    // Stores the uploaded file
  const [textValue, setTextValue] = useState('');            // Stores manually entered text
  const [featureList, setFeatureList] = useState([]);        // Holds list of model feature names
  const fileInputRef = useRef(null);                         // Ref for hidden file input element
  const navigate = useNavigate();                            // Used for page redirection
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [featureList, setFeatureList] = useState([]);
  const [featureFilter, setFeatureFilter] = useState('');
  const [manualValues, setManualValues] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
      .then((f) => {
        setFeatureList(Array.isArray(f) ? f : []);
        const init = {};
        (Array.isArray(f) ? f : []).forEach(name => { init[name] = ''; });
        setManualValues(init);
      })
      .catch(() => {
        setFeatureList([]);
        setManualValues({});
      });
  }, []);

  const filteredFeatures = useMemo(() => {
    const q = featureFilter.trim().toLowerCase();
    if (!q) return featureList;
    return featureList.filter(f => f.toLowerCase().includes(q));
  }, [featureList, featureFilter]);

  const handleFileSelectClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setTextValue('');
    try {
      const txt = await readFileAsText(file);
      const parsed = parseCsvFirstRow(txt, featureList);
      setManualValues(prev => ({ ...prev, ...parsed }));
    } catch {
    }
  };

  // --- HANDLE TEXT INPUT ---
  const handleTextChange = (event) => {
    setTextValue(event.target.value);
    if (event.target.value) setSelectedFile(null); // Clear file selection if user types text
    const t = event.target.value;
    setTextValue(t);
    setSelectedFile(null);
    const parsed = parseTextToFeatures(t, featureList);
    setManualValues(prev => ({ ...prev, ...parsed }));
  };

  const handleManualChange = (name, value) => {
    setManualValues(prev => ({ ...prev, [name]: value }));
  };

  const clearManualValue = (name) => {
    setManualValues(prev => ({ ...prev, [name]: '' }));
  };

  const clearAllManual = () => {
    const cleared = {};
    featureList.forEach(n => { cleared[n] = ''; });
    setManualValues(cleared);
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
    const out = {};
    if (!text || !text.trim()) return out;

    try {
      // Try parsing as JSON first
      const obj = JSON.parse(text);
      features.forEach(f => {
        const v = obj[f];
        out[f] = (v === undefined || v === null || v === '') ? '' : String(v);
      });
      return out;
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
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    lines.forEach(line => {
      const i = line.indexOf('=');
      if (i <= 0) return;
      const k = line.slice(0, i).trim();
      const raw = line.slice(i + 1).trim();
      if (!features.includes(k)) return;
      out[k] = raw;
    });
    return out;
  };

  // --- HELPER: PARSE CSV (first row only) ---
  const parseCsvFirstRow = (csvText, features) => {
    const out = {};
    const lines = csvText.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return base;

    const header = lines[0].split(',').map(s => s.trim());
    const row = lines[1].split(',').map(s => s.trim());

    if (lines.length < 2) return out;
    const header = lines[0].split(',').map(s => s.trim());
    const row = lines[1].split(',').map(s => s.trim());
    header.forEach((h, idx) => {
      if (features.includes(h)) out[h] = row[idx] ?? '';
    });
    return out;
  };

  const buildPayloadFeatures = () => {
    const payload = {};
    for (const name of featureList) {
      const raw = manualValues[name];
      if (raw === undefined || raw === null) continue;
      const trimmed = String(raw).trim();
      if (trimmed === '') continue; 
      const num = Number(trimmed);
      if (!Number.isNaN(num)) payload[name] = num;
    }
    return payload;
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
      const featuresObj = buildPayloadFeatures();

      // Send parsed data to backend for prediction
      const res = await predictOne(featuresObj);

      const status = (res.decision === 'benign') ? 'SAFE' : 'MALICIOUS';

      const score = 98;

      // Build analysis result object for localStorage
      const analysisDetail = {
        id: new Date().toISOString(),
        type: selectedFile ? 'File' : 'Text',
        name: selectedFile
          ? selectedFile.name
          : textValue
          ? textValue.substring(0, 30) + '...'
          : 'Manual Features',
          : (textValue ? (textValue.substring(0, 30) + '...') : 'Manual Features'),
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
      alert('Prediction failed. Ensure backend is running and your feature inputs are valid numbers.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- PAGE LAYOUT ---
  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      
      {/* Hidden file input (triggered by "Select File" button) */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

      {/* Page Title */}
    <Container sx={{ mt: 8, mb: 6 }}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

      <Typography variant="h4" gutterBottom>Upload</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        🔒 Your data is processed securely and not stored.
      </Typography>

      {/* --- FILE UPLOAD SECTION --- */}
      <Paper variant="outlined" sx={{ borderStyle: 'dashed', p: 4, mb: 3 }}>
      <Paper variant="outlined" sx={{ borderStyle: 'dashed', p: 3, mb: 3 }}>
        {selectedFile ? (
          // Display selected file info
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <InsertDriveFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1">{selectedFile.name}</Typography>
          </Box>
        ) : (
          <Typography>Upload File or paste JSON/key=value below.</Typography>
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
        <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
          <Button variant="contained" disabled={isLoading} onClick={handleFileSelectClick}>
            Upload File
          </Button>
          <Button variant="text" color="inherit" onClick={() => { setSelectedFile(null); setTextValue(''); }}>
            Clear
          </Button>
        </Box>
        <TextField
          multiline
          fullWidth
          minRows={4}
          placeholder='{"Machine":0,"SizeOfOptionalHeader":224,...}  or  Machine=0'
          sx={{ mt: 2 }}
          disabled={isLoading}
          value={textValue}
          onChange={handleTextChange}
        />
      </Paper>

      <Accordion defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 600 }}>Manual Feature Entry</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search feature..."
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearAllManual}>
              Clear All
            </Button>
          </Box>

          <Grid container spacing={1.5}>
            {filteredFeatures.map((name) => (
              <Grid item xs={12} sm={6} md={4} key={name}>
                <TextField
                  label={name}
                  value={manualValues[name] ?? ''}
                  onChange={(e) => handleManualChange(name, e.target.value)}
                  placeholder="(blank = ignore)"
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {manualValues[name] ? (
                          <IconButton size="small" onClick={() => clearManualValue(name)} aria-label="clear">
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        ) : null}
                      </InputAdornment>
                    ),
                    inputMode: 'decimal'
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#131414', color: '#F9F7F0', width: 180, height: 44 }}
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: '#F9F7F0' }} /> : 'ANALYSE'}
        </Button>
      </Box>
    </Container>
  );
}
