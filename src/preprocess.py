import os, sys, re
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
if "classification" not in df.columns:
    print("Expected 'classification' column not found.")
    sys.exit(1)

if "hash" in df.columns:
    df = df.drop(columns=["hash"])

df = df.drop_duplicates()

y_raw = df["classification"]
if y_raw.dtype == object:
    y_mapped = y_raw.astype(str).str.lower().map(
        lambda s: 1 if re.search(r"mal|virus|trojan|worm|ransom|attack|bad|malicious", s) else 0 if re.search(r"benign|clean|good|normal|safe|legit", s) else np.nan
    )
    if y_mapped.isna().any():
        uniq = sorted(y_raw.astype(str).str.lower().unique().tolist())
        print("Unrecognized label values:", uniq)
        sys.exit(1)
    y = y_mapped.astype(int)
else:
    uniq = sorted(pd.Series(y_raw.unique()).tolist())
    if set(uniq).issubset({0,1}):
        y = y_raw.astype(int)
    else:
        print("Numeric labels are not binary:", uniq)
        sys.exit(1)

X = df.drop(columns=["classification"])

for c in X.columns:
    if pd.api.types.is_numeric_dtype(X[c]):
        X[c] = X[c].fillna(X[c].median())
    elif pd.api.types.is_bool_dtype(X[c]):
        X[c] = X[c].fillna(False).astype(int)
    else:
        X[c] = X[c].astype(str).replace({"nan":"UNKNOWN","None":"UNKNOWN"}).fillna("UNKNOWN")

obj_cols = X.select_dtypes(include=["object"]).columns.tolist()
obj_low_card = [c for c in obj_cols if X[c].nunique(dropna=True) <= 50]
X = pd.get_dummies(X, columns=obj_low_card, drop_first=True)
high_card = [c for c in obj_cols if c not in obj_low_card]
if high_card:
    X = X.drop(columns=high_card)

num_cols = X.select_dtypes(include=[np.number]).columns.tolist()
scaler = StandardScaler()
X[num_cols] = scaler.fit_transform(X[num_cols])

if y.nunique() < 2:
    print("Label column has fewer than 2 classes after preprocessing.")
    sys.exit(1)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

os.makedirs(OUT_DIR, exist_ok=True)
X_train.to_csv(os.path.join(OUT_DIR, "X_train.csv"), index=False)
X_test.to_csv(os.path.join(OUT_DIR, "X_test.csv"), index=False)
y_train.to_csv(os.path.join(OUT_DIR, "y_train.csv"), index=False)
y_test.to_csv(os.path.join(OUT_DIR, "y_test.csv"), index=False)

print("✅ Data processing complete → data/processed/")
