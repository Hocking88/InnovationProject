import joblib
import numpy as np
import pandas as pd
from typing import List, Dict

class MalwareModel:
    def __init__(self, model_path: str = "artifacts/model_pipeline.joblib"):
        self.model = joblib.load(model_path)
        if hasattr(self.model, "feature_names_in_"):
            self.feature_order = list(self.model.feature_names_in_)
        else:
            raise RuntimeError("Model must be fit on a pandas DataFrame so feature_names_in_ exists.")

    def features(self) -> List[str]:
        return self.feature_order

    def _coerce_rows(self, rows: List[Dict]) -> pd.DataFrame:
        df = pd.DataFrame(rows)
        for f in self.feature_order:
            if f not in df.columns:
                df[f] = 0
        df = df[self.feature_order]
        df = df.replace([np.inf, -np.inf], 0).fillna(0)
        return df

    def predict_one(self, features: Dict) -> Dict:
        X = self._coerce_rows([features])
        y = self.model.predict(X)
        if hasattr(self.model, "predict_proba"):
            p = self.model.predict_proba(X)[:, 1]
        else:
            p = np.zeros(len(y))
        return {"label": int(y[0]), "probability": float(p[0])}

    def predict_batch(self, rows: List[Dict]) -> Dict:
        X = self._coerce_rows(rows)
        y = self.model.predict(X).astype(int).tolist()
        if hasattr(self.model, "predict_proba"):
            p = self.model.predict_proba(X)[:, 1].tolist()
        else:
            p = [0.0] * len(y)
        return {"labels": y, "probabilities": [float(v) for v in p]}
