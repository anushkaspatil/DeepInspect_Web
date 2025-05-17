from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from typing import Optional, Dict # Added Dict
import torch
import cv2
import numpy as np
import io
import os
from datetime import datetime
import sqlite3
from pydantic import BaseModel
from ultralytics import YOLO

app = FastAPI(title="Defect Detection API",
              description="API for detecting and storing product defects",
              version="1.0.0")

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

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load the YOLOv8 model and get class names ---
MODEL_PATH = "Model/best.pt"
class_names: Dict[int, str] = {} # Initialize class_names dictionary
try:
    model = YOLO(MODEL_PATH)
    # *** IMPORTANT: Access the class names from the model ***
    if hasattr(model, 'names') and isinstance(model.names, dict):
        class_names = model.names
        print(f"Model loaded successfully. Class names: {class_names}")
    else:
        print("Warning: Could not automatically load class names from the model.")
        # You might need to manually define them if the above fails, e.g.:
        # class_names = {0: 'rolled pit', 1: 'scratch', 2: 'inclusion', ...}
except Exception as e:
    print(f"Error loading YOLO model from {MODEL_PATH}: {e}")
    # Handle the error appropriately, maybe raise an exception or exit
    # For now, we'll let it continue but predictions might fail or use default names
    model = None # Indicate model loading failed

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

init_db()

class DefectStore(BaseModel):
    defect_type: str
    timestamp: str
    item_number: int
    stream_number: int
    batch_number: int
    image_name: str

defect_metadata_cache = {}

@app.post("/predict/")
async def predict_defect(file: UploadFile = File(...)):
    if not model: # Check if model loaded successfully
        raise HTTPException(status_code=500, detail="Model not loaded properly.")

    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # It's generally better to predict directly on the numpy array
    # Saving and reloading adds unnecessary I/O, unless required by the model interface
    # temp_image_path = f"temp_{file.filename}"
    # cv2.imwrite(temp_image_path, img)

    try:
        # Predict using the image in memory (more efficient)
        results = model.predict(source=img, save=False, conf=0.25)
        pred = results[0] # Get the first prediction result
        boxes = pred.boxes
        defect_type = "No defect detected" # Default value

        if boxes and boxes.cls.numel() > 0:
            # Get the class ID of the first detected object
            class_id = int(boxes.cls[0].item())

            # *** CHANGE: Look up the class name using the class_id ***
            defect_type = class_names.get(class_id, f"Unknown Class {class_id}") # Use .get for safety

            # Get bounding box coordinates
            x1, y1, x2, y2 = map(int, boxes.xyxy[0].tolist())

            # Draw rectangle and label on the image
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, defect_type, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Metadata caching
        current_time = datetime.now().strftime("%H:%M:%S")
        defect_info = {
            "type": defect_type, # Use the actual defect name (or "No defect detected")
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

        # Return the image as a streaming response
        return StreamingResponse(io.BytesIO(buffer.tobytes()), media_type="image/jpeg")

    except Exception as e:
        # Log the error for debugging
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    # finally:
        # No need for finally block if not saving temp file
        # if os.path.exists(temp_image_path):
        #     os.remove(temp_image_path)


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
    except sqlite3.Error as e: # Catch specific DB errors
        conn.rollback()
        print(f"Database error: {e}") # Log DB errors
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e: # Catch other potential errors
        conn.rollback()
        print(f"Error storing defect: {e}") # Log other errors
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
    finally:
        conn.close()


if __name__ == "__main__":
    import uvicorn
    # Ensure model is loaded before starting the server
    if model is None:
        print("Exiting: YOLO model could not be loaded.")
    else:
        uvicorn.run(app, host="127.0.0.1", port=8000)