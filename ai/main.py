"""
NIRMAAN AI Inference Microservice (FastAPI)
Exposes endpoints for Multi-Object Waste Classification, Quality Validation,
Smart Bin Overflow Prediction, and Delhi Municipal Hotspot Intelligence.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

from inference.multi_classifier import classify_waste_multiobject
from inference.image_quality import check_image_quality
from inference.overflow_model import predict_bin_overflow
from inference.hotspot_model import predict_hotspot_risk

app = FastAPI(
    title="NIRMAAN AI Microservice (Delhi Waste OS)",
    description="Multi-object vision classification, overflow forecasting, and municipal hotspot intelligence",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClassifyRequest(BaseModel):
    image: Optional[str] = None
    imageName: Optional[str] = None
    filename: Optional[str] = None
    category: Optional[str] = None
    tag: Optional[str] = None


class BinTelemetryRequest(BaseModel):
    id: Optional[str] = "BIN-DL-104"
    currentFill: float = 68.0
    fillRatePerHour: Optional[float] = 4.8
    history: Optional[List[Dict[str, Any]]] = None


class HotspotRequest(BaseModel):
    sectorName: Optional[str] = "Karol Bagh"
    historicalDailyLoadKg: Optional[List[float]] = None


@app.get("/")
def root():
    return {
        "service": "NIRMAAN Delhi AI Vision & Telematics Engine",
        "version": "2.0.0",
        "status": "OPERATIONAL",
        "models_loaded": [
            "MobileNetV3-MultiObject-WasteSeg",
            "Image-Quality-Analyzer",
            "Time-Series-Overflow-Regr",
            "Delhi-Hotspot-Forecaster"
        ]
    }


@app.post("/api/classify")
def classify(req: ClassifyRequest):
    return classify_waste_multiobject(req.model_dump())


@app.post("/api/quality-check")
def quality_check(req: ClassifyRequest):
    return check_image_quality(req.model_dump())


@app.post("/api/predict-overflow")
def predict_overflow(req: BinTelemetryRequest):
    return predict_bin_overflow(req.model_dump())


@app.post("/api/predict-hotspots")
def predict_hotspots(req: HotspotRequest):
    return predict_hotspot_risk(req.model_dump())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
