from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from ultralytics import YOLO
import shutil
import os

app = FastAPI()

# Load the YOLOv8 model
model = YOLO("Model/best.pt")

# Make sure the static folder exists
os.makedirs("static", exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to the YOLOv8 detection API!"}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Save uploaded image to disk
    image_path = f"static/{file.filename}"
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run prediction
    results = model(image_path)

    # Save annotated image
    output_path = "static/predicted.jpg"
    results[0].save(filename=output_path)

    # Return annotated image
    return FileResponse(output_path, media_type="image/jpeg")
