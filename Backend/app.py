from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
import sqlite3
import numpy as np
import cv2
import io
import os
import torch
from ultralytics import YOLO

from users import router as users_router

# Initialize app
app = FastAPI(
    title="Defect Detection API",
    description="API for detecting and storing product defects",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domains in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include user routes
app.include_router(users_router, prefix="/users", tags=["users"])

# DB init for defect detection
DB_PATH = "data/defects.db"

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS defects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            defect_type TEXT,
            timestamp TEXT,
            item_number INTEGER,
            stream_number INTEGER,
            batch_number INTEGER,
            image_name TEXT,
            created_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Load model
os.environ['TORCH_LOAD_WEIGHTS_ONLY'] = 'False'
original_load = torch.load
def patched_load(*args, **kwargs):
    if 'weights_only' not in kwargs:
        kwargs['weights_only'] = False
    return original_load(*args, **kwargs)
torch.load = patched_load

MODEL_PATH = "Model/best.pt"
class_names = {}

try:
    model = YOLO(MODEL_PATH)
    class_names = model.names if hasattr(model, 'names') and isinstance(model.names, dict) else {0: 'rolled pit', 1: 'scratch', 2: 'inclusion'}
except Exception as e:
    print(f"Model load error: {e}")
    model = None
    class_names = {0: 'rolled pit', 1: 'scratch', 2: 'inclusion'}
torch.load = original_load

class DefectStore(BaseModel):
    defect_type: str
    timestamp: str
    item_number: int
    stream_number: int
    batch_number: int
    image_name: str

defect_metadata_cache = {}

@app.get("/")
def root():
    return {"message": "Defect Detection API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/predict/")
async def predict_defect(file: UploadFile = File(...)):
    try:
        if not model:
            raise HTTPException(status_code=500, detail="Model not loaded")

        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        contents = await file.read()
        img_array = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image")

        results = model.predict(source=img, save=False, conf=0.25)
        boxes = results[0].boxes
        defect_type = "No defect detected"

        if boxes and boxes.cls.numel() > 0:
            class_id = int(boxes.cls[0].item())
            defect_type = class_names.get(class_id, f"Unknown Class {class_id}")
            x1, y1, x2, y2 = map(int, boxes.xyxy[0].tolist())
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, defect_type, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        current_time = datetime.now().strftime("%H:%M:%S")
        defect_metadata_cache[file.filename] = {
            "type": defect_type,
            "time": current_time,
            "item": np.random.randint(1000, 2000),
            "stream": np.random.randint(1, 6),
            "batch": np.random.randint(1, 21)
        }

        _, buffer = cv2.imencode(".jpg", img)
        return StreamingResponse(io.BytesIO(buffer.tobytes()), media_type="image/jpeg")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/predict/metadata")
def get_defect_metadata(filename: str):
    if filename not in defect_metadata_cache:
        raise HTTPException(status_code=404, detail="Metadata not found")
    return defect_metadata_cache[filename]

@app.post("/store/")
def store_defect(defect: DefectStore):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''
            INSERT INTO defects (defect_type, timestamp, item_number, stream_number, batch_number, image_name, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            defect.defect_type, defect.timestamp, defect.item_number,
            defect.stream_number, defect.batch_number, defect.image_name,
            datetime.now().isoformat()
        ))
        conn.commit()
        return {"status": "success", "message": "Defect stored"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()
