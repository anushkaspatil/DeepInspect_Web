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
import onnxruntime as ort

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
MODEL_PATH = "Model/best.onnx"
session = ort.InferenceSession(MODEL_PATH)
model = None

def load_model():
    global model
    if model is None:
        # Load YOLOv8 model
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
    
    # Read and decode image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # Save temporarily for debugging or traceability
    temp_image_path = f"temp_{file.filename}"
    cv2.imwrite(temp_image_path, img)

    try:
        # Preprocess image for ONNX model (resize, normalize, etc.)
        resized = cv2.resize(img, (640, 640))
        img_rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
        img_input = img_rgb.transpose(2, 0, 1).astype(np.float32)  # (3, 640, 640)
        img_input /= 255.0  # normalize to 0–1
        img_input = np.expand_dims(img_input, axis=0)  # shape: (1, 3, 640, 640)

        # Run inference
        input_name = session.get_inputs()[0].name
        outputs = session.run(None, {input_name: img_input})

        # Postprocess outputs
        # YOLOv8 ONNX outputs one tensor with shape (batch, num_preds, 85) = [x, y, w, h, conf, cls...]
        pred = outputs[0][0]  # shape: (num_boxes, 85)
        boxes = pred[pred[:, 4] > 0.25]  # confidence threshold

        defect_type = "No defect detected"
        if boxes.shape[0] > 0:
            class_id = int(boxes[0][5])
            defect_type = f"Class {class_id}"  # Optional: replace with actual label map if available

            # Draw bounding box
            x_center, y_center, width, height = boxes[0][:4]
            x1 = int((x_center - width / 2) * img.shape[1] / 640)
            y1 = int((y_center - height / 2) * img.shape[0] / 640)
            x2 = int((x_center + width / 2) * img.shape[1] / 640)
            y2 = int((y_center + height / 2) * img.shape[0] / 640)

            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, defect_type, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Cache metadata
        current_time = datetime.now().strftime("%H:%M:%S")
        defect_info = {
            "type": defect_type,
            "time": current_time,
            "item": np.random.randint(1000, 2000),
            "stream": np.random.randint(1, 6),
            "batch": np.random.randint(1, 21)
        }
        defect_metadata_cache[file.filename] = defect_info

        # Encode image to return
        is_success, buffer = cv2.imencode(".jpg", img)
        if not is_success:
            raise HTTPException(status_code=500, detail="Failed to process image")

        return StreamingResponse(io.BytesIO(buffer.tobytes()), media_type="image/jpeg")

    finally:
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