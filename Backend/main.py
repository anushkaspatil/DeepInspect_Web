from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil, os
from datetime import datetime
import uuid
import torch
from predict import detect_defect
from database import save_defect_record

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DefectRecord(BaseModel):
    type: str
    time: str
    item: int
    stream: int
    batch: int
    image_name: str

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    image_id = str(uuid.uuid4())
    input_path = f"uploads/{image_id}_{file.filename}"
    output_path = f"outputs/{image_id}_{file.filename}"

    # Save uploaded file
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run inference using your YOLO model
    defect_type = detect_defect(input_path, output_path)

    # Return processed image
    return FileResponse(path=output_path, media_type="image/jpeg")

@app.post("/store/")
async def store_defect(data: DefectRecord):
    save_defect_record(data)
    return {"message": "Stored successfully"}
