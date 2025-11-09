from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
from model import MalwareModel

# Fast API app setup
app = FastAPI(title="Malware Analysis API", version="1.0.0")

# React dev server calls the API from these origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ML model
model = MalwareModel()

# Pydantic models for request bodies
class PredictIn(BaseModel):
    features: Dict[str, float]

class PredictBatchIn(BaseModel):
    rows: List[Dict[str, float]]

@app.get("/")
def root():
    return {"message": "Malware Analysis API is running."}

# Health API Endpoint
@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True, "n_features": len(model.features())}

# Features API Endpoint
@app.get("/features")
def features():
    return {"features": model.features()}

# Predict API Endpoint
@app.post("/predict")
def predict(payload: PredictIn):
    try:
        return model.predict_one(payload.features)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
