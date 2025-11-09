import axios from "axios";

const API_BASE = "http://localhost:8000";

export async function getFeatures() {
  const r = await axios.get(`${API_BASE}/features`);
  return r.data.features;
}

export async function predictOne(features) {
  const r = await axios.post(`${API_BASE}/predict`, { features });
  return r.data;
}
