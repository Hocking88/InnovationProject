# tests/test_api_ep_bva.py

import os, importlib.util
from fastapi.testclient import TestClient

# --- load the real backend/main.py with correct import context ---
import os, sys, importlib.util

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)   # so "from model import ..." works

MAIN_PATH = os.path.join(BACKEND_DIR, 'main.py')
spec = importlib.util.spec_from_file_location("main", MAIN_PATH)
if spec is None or spec.loader is None:
    raise ImportError("Could not load the main module or its loader")
main = importlib.util.module_from_spec(spec)
spec.loader.exec_module(main)         # executes main.py, now it can import model.py

from fastapi.testclient import TestClient
client = TestClient(main.app)
# -----------------------------------------------------------------




def _base_features():
    feats = client.get("/features").json()["features"]
    return {f: 0 for f in feats}

def test_predict_ep_valid_minimal():
    r = client.post("/predict", json={"features": _base_features()})
    assert r.status_code == 200
    body = r.json()
    assert "label" in body

def test_predict_bva_extremes_do_not_crash():
    feats = _base_features()
    keys = list(feats.keys())[:3]
    feats[keys[0]] = 0
    feats[keys[1]] = -1           
    feats[keys[2]] = 10**6        
    r = client.post("/predict", json={"features": feats})
    assert r.status_code == 200

def test_predict_empty_rows_is_invalid():
    r = client.post("/predict", json={"rows": []})
    assert r.status_code == 422

