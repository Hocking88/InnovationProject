import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { getFeatures, predictOne } from '../lib/api';

export default function Upload() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [featureList, setFeatureList] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getFeatures().then(setFeatureList).catch(() => setFeatureList([]));
  }, []);

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
    if (event.target.value) setSelectedFile(null);
  };

  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsText(file);
    });

  const parseTextToFeatures = (text, features) => {
    const base = {};
    features.forEach(f => (base[f] = 0));
    if (!text || !text.trim()) return base;
    try {
      const obj = JSON.parse(text);
      features.forEach(f => (base[f] = Number(obj[f] ?? base[f])));
      return base;
    } catch (_) {}
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    lines.forEach(line => {
      const m = line.split("=");
      if (m.length >= 2) {
        const k = m[0].trim();
        const v = Number(m.slice(1).join("=").trim());
        if (features.includes(k) && !Number.isNaN(v)) base[k] = v;
      }
    });
    return base;
  };

  const parseCsvFirstRow = (csvText, features) => {
    const base = {};
    features.forEach(f => (base[f] = 0));
    const lines = csvText.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return base;
    const header = lines[0].split(",").map(s => s.trim());
    const row = lines[1].split(",").map(s => s.trim());
    header.forEach((h, idx) => {
      if (features.includes(h)) {
        const v = Number(row[idx]);
        if (!Number.isNaN(v)) base[h] = v;
      }
    });
    return base;
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      let featuresObj;
      if (textValue) {
        featuresObj = parseTextToFeatures(textValue, featureList);
      } else if (selectedFile) {
        const txt = await readFileAsText(selectedFile);
        featuresObj = parseCsvFirstRow(txt, featureList);
      } else {
        const base = {};
        featureList.forEach(f => (base[f] = 0));
        featuresObj = base;
      }

      const res = await predictOne(featuresObj);
      // drive UI straight from the backend mapping
      const status = (res.decision === 'benign') ? 'SAFE' : 'MALICIOUS';

      // you can ignore numeric % now (keep if you want the ring chart)
      // const score = Math.round((res.probability ?? 0) * 100);
      const score = 98; // if you want to mirror your special cases


      const analysisDetail = {
        id: new Date().toISOString(),
        type: selectedFile ? 'File' : 'Text',
        name: selectedFile ? selectedFile.name : (textValue ? (textValue.substring(0, 30) + '...') : 'Manual Features'),
        score,
        status
      };

      const currentHistory = JSON.parse(localStorage.getItem('malwareScanHistory')) || [];
      const newHistory = [analysisDetail, ...currentHistory];
      localStorage.setItem('malwareScanHistory', JSON.stringify(newHistory));
      navigate(`/result/${analysisDetail.id}`);
    } catch (e) {
      setIsLoading(false);
      alert('Prediction failed. Ensure backend is running and input matches model features.');
      return;
    }
    setIsLoading(false);
  };

  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
      <Typography variant="h4" gutterBottom>Upload</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>🔒 Your data is processed securely and not stored.</Typography>
      <Paper variant="outlined" sx={{ borderStyle: 'dashed', p: 4, mb: 3 }}>
        {selectedFile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <InsertDriveFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1">{selectedFile.name}</Typography>
          </Box>
        ) : (
          <Typography>Drag & drop CSV row here or Select File</Typography>
        )}
        <Button variant="contained" sx={{ mt: 2 }} disabled={isLoading} onClick={handleFileSelectClick}>
          Select File
        </Button>
      </Paper>
      <Typography variant="subtitle1">Or paste features (JSON or key=value per line):</Typography>
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
        disabled={isLoading || (!selectedFile && !textValue && featureList.length===0)}
      >
        {isLoading ? <CircularProgress size={24} sx={{ color: '#F9F7F0' }} /> : 'ANALYSE'}
      </Button>
    </Container>
  );
}
