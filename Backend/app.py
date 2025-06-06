from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Optional, Dict
import cv2
import numpy as np
import io
import os
from datetime import datetime
import sqlite3
from pydantic import BaseModel
from ultralytics import YOLO
import torch
import os

app = FastAPI(title="Defect Detection API",
              description="API for detecting and storing product defects",
              version="1.0.0")

# Enhanced CORS configuration - MUST be added before other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Root endpoint
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

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# --- Load the YOLOv8 model and get class names ---
os.environ['TORCH_LOAD_WEIGHTS_ONLY'] = 'False'

# Or alternatively, monkey patch torch.load temporarily
original_load = torch.load
def patched_load(*args, **kwargs):
    if 'weights_only' not in kwargs:
        kwargs['weights_only'] = False
    return original_load(*args, **kwargs)

torch.load = patched_load

MODEL_PATH = "Model/best.pt"
class_names = {}

try:
    print(f"Attempting to load model from: {MODEL_PATH}")
    model = YOLO(MODEL_PATH)
    
    if hasattr(model, 'names') and isinstance(model.names, dict):
        class_names = model.names
        print(f"Model loaded successfully. Class names: {class_names}")
    else:
        print("Warning: Could not automatically load class names from the model.")
        class_names = {0: 'rolled pit', 1: 'scratch', 2: 'inclusion'}
        
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None
    class_names = {0: 'rolled pit', 1: 'scratch', 2: 'inclusion'}

# Restore original torch.load
torch.load = original_load

print(f"Final class names: {class_names}")
# Database setup
DB_PATH = "data/defects.db"

def init_db():
    # Create data directory if it doesn't exist
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

class DefectStore(BaseModel):
    defect_type: str
    timestamp: str
    item_number: int
    stream_number: int
    batch_number: int
    image_name: str

defect_metadata_cache = {}

@app.options("/predict/")
async def predict_options():
    """Handle preflight OPTIONS request for CORS"""
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.post("/predict/")
async def predict_defect(file: UploadFile = File(...)):
    try:
        if not model:
            raise HTTPException(status_code=500, detail="Model not loaded properly.")

        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        print("Received file:", file.filename)
        print("Reading image...")
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        print(f"Decoded image: {img.shape if img is not None else 'None'}")
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Predict using the image in memory
        print("Running prediction...")
        results = model.predict(source=img, save=False, conf=0.25)
        print("Prediction done")
        pred = results[0]
        boxes = pred.boxes
        print("Boxes:", boxes)
        defect_type = "No defect detected"

        if boxes and boxes.cls is not None:
            print("Detected classes:", boxes.cls)

        if boxes and boxes.cls.numel() > 0:
            class_id = int(boxes.cls[0].item())
            defect_type = class_names.get(class_id, f"Unknown Class {class_id}")

            # Get bounding box coordinates
            x1, y1, x2, y2 = map(int, boxes.xyxy[0].tolist())

            # Draw rectangle and label on the image
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, defect_type, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Metadata caching
        current_time = datetime.now().strftime("%H:%M:%S")
        defect_info = {
            "type": defect_type,
            "time": current_time,
            "item": np.random.randint(1000, 2000),
            "stream": np.random.randint(1, 6),
            "batch": np.random.randint(1, 21)
        }
        defect_metadata_cache[file.filename] = defect_info

        # Encode the modified image to JPEG format in memory
        is_success, buffer = cv2.imencode(".jpg", img)
        if not is_success:
            raise HTTPException(status_code=500, detail="Failed to encode processed image")

        # Return the image as a streaming response with CORS headers
        response = StreamingResponse(
            io.BytesIO(buffer.tobytes()), 
            media_type="image/jpeg",
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "*",
            }
        )
        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/predict/metadata")
async def get_defect_metadata(filename: str):
    if filename not in defect_metadata_cache:
        raise HTTPException(status_code=404, detail="Metadata not found for this filename. Prediction might not have been run or cache cleared.")

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
    except sqlite3.Error as e:
        conn.rollback()
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        conn.rollback()
        print(f"Error storing defect: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    if model is None:
        print("Warning: YOLO model could not be loaded, but starting server anyway.")
    
    # Ensure server binds to all interfaces
    uvicorn.run(app, host="0.0.0.0", port=8000)