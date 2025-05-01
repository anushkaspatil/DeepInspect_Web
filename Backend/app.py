from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Optional
import torch
import cv2
import numpy as np
import io
import os
from datetime import datetime
import sqlite3
from pydantic import BaseModel
from ultralytics import YOLO  # Import YOLO from ultralytics for YOLOv8

app = FastAPI(title="Defect Detection API", 
             description="API for detecting and storing product defects",
             version="1.0.0")

# Root endpoint for API information
@app.get("/")
async def root():
    return {
        "message": "Defect Detection API is running",
        "endpoints": {
            "/predict/": "Upload an image to detect defects",
            "/predict/metadata": "Get metadata for a detected defect",
            "/store/": "Store defect information in the database"
        },
        "status": "online"
    }

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load the YOLOv8 model
MODEL_PATH = "Model/best.pt"
model = None

def load_model():
    global model
    if model is None:
        # Load YOLOv8 model
        from ultralytics import YOLO
        model = YOLO(MODEL_PATH)
        model.conf = 0.25  # Confidence threshold
    return model

# Database setup
DB_PATH = "defects.db"

def init_db():
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

# Initialize the database on startup
init_db()

# Create a class for defect storage request
class DefectStore(BaseModel):
    defect_type: str
    timestamp: str
    item_number: int
    stream_number: int
    batch_number: int
    image_name: str

# Metadata cache to store defect information
defect_metadata_cache = {}

@app.post("/predict/")
async def predict_defect(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Read the image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    # Save image temporarily (YOLOv8 works better with file paths)
    temp_image_path = f"temp_{file.filename}"
    cv2.imwrite(temp_image_path, img)
    
    try:
        # Load model if not already loaded
        model = load_model()
        
        # Make prediction with YOLOv8
        results = model(temp_image_path)
        
        # Process results to get defect type
        result = results[0]  # Get first result
        
        defect_type = "No defect detected"
        if len(result.boxes) > 0:
            # Get the first detected defect class
            class_id = int(result.boxes[0].cls.item())
            defect_type = result.names[class_id]
        
        # Create defect info
        current_time = datetime.now().strftime("%H:%M:%S")
        defect_info = {
            "type": defect_type,
            "time": current_time,
            "item": np.random.randint(1000, 2000),  # Simulated item number
            "stream": np.random.randint(1, 6),      # Simulated stream number
            "batch": np.random.randint(1, 21)       # Simulated batch number
        }
        
        # Store in cache
        defect_metadata_cache[file.filename] = defect_info
        
        # Get the plotted image with boxes
        results_img = result.plot()
        
        # Convert back to image bytes
        is_success, buffer = cv2.imencode(".jpg", results_img)
        if not is_success:
            raise HTTPException(status_code=500, detail="Failed to process image")
        
        # Return the processed image
        return StreamingResponse(io.BytesIO(buffer.tobytes()), media_type="image/jpeg")
    
    finally:
        # Clean up temporary file
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)

@app.get("/predict/metadata")
async def get_defect_metadata(filename: str):
    if filename not in defect_metadata_cache:
        raise HTTPException(status_code=404, detail="Metadata not found")
    
    return defect_metadata_cache[filename]

@app.post("/store/")
async def store_defect(defect: DefectStore):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    try:
        c.execute(
            '''
            INSERT INTO defects 
            (defect_type, timestamp, item_number, stream_number, batch_number, image_name, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''',
            (
                defect.defect_type,
                defect.timestamp,
                defect.item_number,
                defect.stream_number,
                defect.batch_number,
                defect.image_name,
                datetime.now().isoformat()
            )
        )
        conn.commit()
        return {"status": "success", "message": "Defect information stored successfully"}
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)