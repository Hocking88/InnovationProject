import joblib
import pandas as pd
import numpy as np

model = joblib.load("artifacts/model_pipeline.joblib")
cols = list(model.feature_names_in_)

# Build a single test row with zeros (or fill with realistic values)
row = pd.DataFrame([np.zeros(len(cols))], columns=cols)

print(type(model))
print(cols[:10])
print(model.predict(row))          # no warning now
print(model.predict_proba(row))    # if classifier supports it
