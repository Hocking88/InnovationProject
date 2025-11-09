const API_BASE = "http://localhost:8000";

export async function getFeatures() {
  const res = await fetch(`${API_BASE}/features`);
  if (!res.ok) throw new Error(`GET /features ${res.status}`);
  const json = await res.json();
  return json.features ?? [];
}

export async function predictOne(features) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });
  if (!res.ok) throw new Error(`POST /predict ${res.status}`);
  return await res.json();
}

export async function predictBatch(rows) {
  const res = await fetch(`${API_BASE}/predict/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows }),
  });
  if (!res.ok) throw new Error(`POST /predict/batch ${res.status}`);
  return await res.json();
}
