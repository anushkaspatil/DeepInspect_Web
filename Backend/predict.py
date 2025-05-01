import torch
from pathlib import Path
from PIL import Image

model = torch.hub.load('ultralytics/yolov5', 'custom', path='Model/best.pt')  # or use YOLOv8

def detect_defect(image_path: str, output_path: str) -> str:
    results = model(image_path)
    results.save(save_dir=Path(output_path).parent)  # saves with annotations
    defect_type = results.pandas().xyxy[0]['name'][0] if len(results.pandas().xyxy[0]) > 0 else 'No Defect'
    return defect_type
