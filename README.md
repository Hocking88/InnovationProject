# InnovationProject
Computing Technology Innovation Project for Swinburne 2025

# Contents
artifacts folder - contains all the machine learning model results and graphs

EDA folder - contains the cleaning scripts for both models and the two cleaned databases that was used in training and testing

raw folder - contains the raw datasets that was used in the cleaning scripts

Basic_Malware_Train.ipynb - Training the basic cleaned dataset with the machine learning models

Custom_Malware_Train.ipynb - Training the custom cleaned dataset with the machine learning models

# Run
Each script is .ipynb format and can be run easy in Visual Studio Code by clicking Run All which cleans the database and then trains and tests it with the relevant scripts

# Backend
cd backend
pip install -r requirements.txt (if an error occurs it might be because of conda. Enter this to fix it: conda deactivate)
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm start

# Tests
cd frontend
npm tests

cd backend 
pip pytest -q

(May have to pip install these two: pip install pytest & pip install httpx)

# Backend Tests
create a git bash terminal

# Connection test
curl http://localhost:8000/

# Health
curl http://localhost:8000/health

# Features
curl http://localhost:8000/features

# Single prediction (Malware)
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"features":{"Machine":0,"SizeOfOptionalHeader":224,"Characteristics":258,"MajorLinkerVersion":9,"MinorLinkerVersion":0}}'

# Single prediction (Benign)
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"features":{"Machine":0,"SizeOfOptionalHeader":2,"Characteristics":12,"MajorLinkerVersion":7,"MinorLinkerVersion":0}}'

