import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Tuple

# Small helper so we can treat "32%" and "23%" as special cases reliably
def _mapped_decision_from_proba(p1: float) -> Tuple[int, str]:
    """
    p1 = probability of class 1 (benign) if available.
    Hard map:
      32% -> malware (label 0)
      23% -> benign  (label 1)
    Else default: p1 >= 0.5 => benign (1), otherwise malware (0).
    """
    # Round-to-percent and small tolerance fallback
    pct = int(round(p1 * 100))
    if pct == 32 or abs(p1 - 0.32) < 0.01:
        return 0, "malware"
    if pct == 23 or abs(p1 - 0.23) < 0.01:
        return 1, "benign"

    # Normal threshold if it's not one of the “weird” values
    if p1 >= 0.5:
        return 1, "benign"
    return 0, "malware"


class MalwareModel:
    def __init__(self, model_path: str = "artifacts/model_pipeline.joblib"):
        self.model = joblib.load(model_path)
        if hasattr(self.model, "feature_names_in_"):
            self.feature_order = list(self.model.feature_names_in_)
        else:
            raise RuntimeError(
                "Model must be fit on a pandas DataFrame so feature_names_in_ exists."
            )

    def features(self) -> List[str]:
        return self.feature_order

    def _coerce_rows(self, rows: List[Dict]) -> pd.DataFrame:
        df = pd.DataFrame(rows)
        # Add any missing training columns with 0
        for f in self.feature_order:
            if f not in df.columns:
                df[f] = 0
        # Keep training column order
        df = df[self.feature_order]
        # Clean up numerics
        df = df.replace([np.inf, -np.inf], 0).fillna(0)
        return df

    def predict_one(self, features: Dict) -> Dict:
        X = self._coerce_rows([features])

        # Base prediction (label)
        y = self.model.predict(X).astype(int)

        # Probability of class 1 (benign) if the pipeline provides it
        if hasattr(self.model, "predict_proba"):
            p1 = float(self.model.predict_proba(X)[:, 1][0])
        else:
            # No probability available; synthesize from label (not used in mapping anyway)
            p1 = 1.0 if int(y[0]) == 1 else 0.0

        # Apply your hard mapping first, otherwise default threshold
        label, decision = _mapped_decision_from_proba(p1)

        return {
            "label": int(label),
            "decision": decision,
            "probability": p1  # keep for debugging; your UI can ignore if you want
        }

    def predict_batch(self, rows: List[Dict]) -> Dict:
        X = self._coerce_rows(rows)
        if hasattr(self.model, "predict_proba"):
            p1_all = self.model.predict_proba(X)[:, 1]
        else:
            # If no proba, use predicted labels to synthesize something
            y_base = self.model.predict(X).astype(int)
            p1_all = np.where(y_base == 1, 1.0, 0.0)

        labels: List[int] = []
        decisions: List[str] = []
        probs: List[float] = []

        for p1 in p1_all:
            lbl, dec = _mapped_decision_from_proba(float(p1))
            labels.append(int(lbl))
            decisions.append(dec)
            probs.append(float(p1))

        return {"labels": labels, "decisions": decisions, "probabilities": probs}
