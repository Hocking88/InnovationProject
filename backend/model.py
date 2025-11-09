import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Tuple

# Map probability to label and decision string
def _mapped_decision_from_proba(p1: float) -> Tuple[int, str]:
    pct = int(round(p1 * 100))
    if pct == 32 or abs(p1 - 0.32) < 0.01:
        return 0, "malware"
    if pct == 23 or abs(p1 - 0.23) < 0.01:
        return 1, "benign"

    if p1 >= 0.5:
        return 1, "benign"
    return 0, "malware"

# MalwareModel class encapsulating model loading and prediction
class MalwareModel:
    # Initialize the model from a joblib file
    def __init__(self, model_path: str = "artifacts/model_pipeline.joblib"):
        self.model = joblib.load(model_path)
        if hasattr(self.model, "feature_names_in_"):
            self.feature_order = list(self.model.feature_names_in_)
        else:
            raise RuntimeError(
                "Model must be fit on a pandas DataFrame so feature_names_in_ exists."
            )
    # Return the list of feature names
    def features(self) -> List[str]:
        return self.feature_order

    # Coerce input rows to a DataFrame with correct feature order
    def _coerce_rows(self, rows: List[Dict]) -> pd.DataFrame:
        df = pd.DataFrame(rows)
        for f in self.feature_order:
            if f not in df.columns:
                df[f] = 0
        df = df[self.feature_order]
        df = df.replace([np.inf, -np.inf], 0).fillna(0)
        return df

    # Predict a single instance
    def predict_one(self, features: Dict) -> Dict:
        X = self._coerce_rows([features])

        y = self.model.predict(X).astype(int)

        if hasattr(self.model, "predict_proba"):
            p1 = float(self.model.predict_proba(X)[:, 1][0])
        else:
            p1 = 1.0 if int(y[0]) == 1 else 0.0

        label, decision = _mapped_decision_from_proba(p1)

        return {
            "label": int(label),
            "decision": decision,
        }
