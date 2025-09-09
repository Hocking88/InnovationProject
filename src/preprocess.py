import os
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

RAW_PATH = "data/raw/malware_dataset.csv"
OUT_DIR = "data/processed"

if not os.path.exists(RAW_PATH):
    print(f"Missing input file: {RAW_PATH}")
    sys.exit(1)

df = pd.read_csv(RAW_PATH)

label_candidates = ["label","Label","class","Class","malware","is_malware","target","y"]
label_col = next((c for c in label_candidates if c in df.columns), None)
if label_col is None:
    print(f"No label column found. Expected one of: {label_candidates}")
    sys.exit(1)

df = df.drop_duplicates()

for c in df.columns:
    if c == label_col:
        continue
    if pd.api.types.is_numeric_dtype(df[c]):
        df[c] = df[c].fillna(df[c].median())
    elif pd.api.types.is_bool_dtype(df[c]):
        df[c] = df[c].fillna(False).astype(int)
    else:
        df[c] = df[c].astype(str).replace({"nan":"UNKNOWN", "None":"UNKNOWN"}).fillna("UNKNOWN")

X = df.drop(columns=[label_col])
y = df[label_col].astype(int) if set(df[label_col].dropna().unique()).issubset({0,1}) else df[label_col]

obj_cols = X.select_dtypes(include=["object"]).columns.tolist()
obj_low_card = [c for c in obj_cols if X[c].nunique(dropna=True) <= 50]
X_encoded = pd.get_dummies(X, columns=obj_low_card, drop_first=True)

high_card = [c for c in obj_cols if c not in obj_low_card]
X_encoded = X_encoded.drop(columns=high_card) if high_card else X_encoded

num_cols = X_encoded.select_dtypes(include=[np.number]).columns.tolist()
scaler = StandardScaler()
X_encoded[num_cols] = scaler.fit_transform(X_encoded[num_cols])

if y.nunique(dropna=True) < 2:
    print("Label column has fewer than 2 classes after preprocessing.")
    sys.exit(1)

X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y, test_size=0.2, random_state=42, stratify=y if y.nunique()<=20 else None
)

os.makedirs(OUT_DIR, exist_ok=True)
X_train.to_csv(os.path.join(OUT_DIR, "X_train.csv"), index=False)
X_test.to_csv(os.path.join(OUT_DIR, "X_test.csv"), index=False)
y_train.to_csv(os.path.join(OUT_DIR, "y_train.csv"), index=False)
y_test.to_csv(os.path.join(OUT_DIR, "y_test.csv"), index=False)

print("Data processing complete into data/processed/")

