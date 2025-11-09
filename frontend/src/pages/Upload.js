// Upload Page
// This page allows users to upload a file or paste text for malware analysis.

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

// ===== Pure, testable helpers =====
export function parseTextToFeatures(text, features) {
  const base = {};
  features.forEach(f => (base[f] = 0));
  if (!text || !text.trim()) return base;

  try {
    const obj = JSON.parse(text);
    features.forEach(f => {
      const v = obj[f];
      base[f] = (v === undefined || v === null || v === '') ? 0 : Number(v);
    });
    return base;
  } catch (_) {}

  // Fallback to key=value parsing
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  lines.forEach(line => {
    const i = line.indexOf('=');
    if (i > 0) {
      const k = line.slice(0, i).trim();
      const v = Number(line.slice(i + 1).trim());
      if (features.includes(k) && !Number.isNaN(v)) base[k] = v;
    }
  });
  return base;
}

export function parseCsvFirstRow(csvText, features) {
  const out = {};
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return out;

  const header = lines[0].split(',').map(s => s.trim());
  const row = lines[1].split(',').map(s => s.trim());
  header.forEach((h, idx) => {
    if (features.includes(h)) out[h] = Number(row[idx]) || 0;
  });
  return out;
}

export function statusFromLabel(label) {
  return label === 1 ? 'SAFE' : 'MALICIOUS';
}

export function shouldEnableExport(status) {
  return status === 'MALICIOUS';
}

export function needsScoreRerender(prevScore, nextScore) {
  return Number(prevScore) !== Number(nextScore);
}

// ===== Main component =====
export default function Upload() {
  // --- STATE VARIABLES ---
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textValue, setTextValue] = useState('');
  const [featureList, setFeatureList] = useState([]);
  const [manualValues, setManualValues] = useState({});
  const [featureFilter, setFeatureFilter] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // --- FETCH MODEL FEATURES ON LOAD ---
  useEffect(() => {
    getFeatures()
      .then(f => {
        const features = Array.isArray(f) ? f : [];
        setFeatureList(features);
        const init = {};
        features.forEach(name => { init[name] = ''; });
        setManualValues(init);
      })
      .catch(() => {
        setFeatureList([]);
        setManualValues({});
      });
  }, []);

  // --- HANDLE FILE SELECTION ---
  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setTextValue('');
    try {
      const txt = await readFileAsText(file);
      const parsed = parseCsvFirstRow(txt, featureList);
      setManualValues(prev => ({ ...prev, ...parsed }));
    } catch {}
  };

  // --- HANDLE TEXT INPUT ---
  const handleTextChange = (event) => {
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
    setTextValue('');
    setSelectedFile(null);
  };

  // --- HELPER: READ FILE CONTENT AS TEXT ---
  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsText(file);
    });

  // --- BUILD PAYLOAD FEATURES ---
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
      const featuresObj = buildPayloadFeatures();
      const res = await predictOne(featuresObj);
      const status = (res.decision === 'benign') ? 'SAFE' : 'MALICIOUS';
      const score = 98; // placeholder

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

      const currentHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
      const newHistory = [analysisDetail, ...currentHistory];
      localStorage.setItem('malwareScanHistory', JSON.stringify(newHistory));

      navigate(`/result/${analysisDetail.id}`);
    } catch {
      alert('Prediction failed. Ensure backend is running and feature inputs are valid numbers.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- FILTERED FEATURES ---
  const filteredFeatures = useMemo(() => {
    const q = featureFilter.trim().toLowerCase();
    if (!q) return featureList;
    return featureList.filter(f => f.toLowerCase().includes(q));
  }, [featureList, featureFilter]);

  // --- PAGE LAYOUT ---
  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

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
          <Typography>Upload File or paste JSON/key=value below.</Typography>
        )}

        <Button variant="contained" sx={{ mt: 2 }} disabled={isLoading} onClick={handleFileSelectClick}>
          Select File
        </Button>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
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

        <Button
          variant="contained"
          sx={{ backgroundColor: '#131414', color: '#F9F7F0', width: 150, height: 40 }}
          onClick={handleAnalyze}
          disabled={isLoading || (!selectedFile && !textValue && featureList.length === 0)}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: '#F9F7F0' }} /> : 'ANALYSE'}
        </Button>
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
    </Container>
  );
}

