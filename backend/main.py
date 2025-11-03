from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
from model import MalwareModel

app = FastAPI(title="Malware Analysis API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = MalwareModel()

class PredictIn(BaseModel):
    features: Dict[str, float]

class PredictBatchIn(BaseModel):
    rows: List[Dict[str, float]]

@app.get("/")
def root():
    return {"message": "Malware Analysis API is running."}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/features")
def features():
    return {"features": model.features()}

@app.post("/predict")
def predict(payload: PredictIn):
    try:
        return model.predict_one(payload.features)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict/batch")
def predict_batch(payload: PredictBatchIn):
    if not payload.rows:
        raise HTTPException(status_code=400, detail="rows must be non-empty")
    try:
        return model.predict_batch(payload.rows)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
