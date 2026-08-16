"""
NIRMAAN AI Overflow Prediction Model
Computes telemetry velocity, delta fill rate, and estimated time to 100% capacity.
"""

from typing import Dict, Any, List


def predict_bin_overflow(bin_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculates time-series overflow forecast
    """
    bin_id = bin_data.get("id", "BIN-104")
    current_fill = float(bin_data.get("currentFill", 50.0))
    history: List[Dict[str, Any]] = bin_data.get("history", [])
    
    # Calculate historical fill rate
    rate = float(bin_data.get("fillRatePerHour", 4.0))
    
    if len(history) >= 2:
        try:
            delta_fill = history[-1]["fill"] - history[0]["fill"]
            steps = len(history) - 1
            if steps > 0 and delta_fill > 0:
                # Average per 2h step -> hourly
                rate = round((delta_fill / (steps * 2.0)), 2)
        except Exception:
            pass

    rate = max(0.5, rate)
    remaining_fill = max(0.0, 100.0 - current_fill)
    eta_hours = round(remaining_fill / rate, 1)

    # Overflow probability score [0.0 - 1.0]
    prob = round(min(0.99, (current_fill / 100.0) * 0.7 + (min(10.0, rate) / 10.0) * 0.3), 2)

    risk_level = "NORMAL"
    if current_fill >= 90 or eta_hours <= 2.5:
        risk_level = "CRITICAL"
    elif current_fill >= 75 or eta_hours <= 5.0:
        risk_level = "HIGH"
    elif current_fill >= 50 or eta_hours <= 12.0:
        risk_level = "MODERATE"

    return {
        "bin_id": bin_id,
        "current_fill": current_fill,
        "fill_rate_per_hour": rate,
        "remaining_capacity_percent": round(remaining_fill, 1),
        "estimated_hours_to_overflow": eta_hours,
        "overflow_probability": prob,
        "risk_level": risk_level,
        "recommended_action": (
            "🚨 Immediate vehicle dispatch required"
            if risk_level == "CRITICAL"
            else "⚠️ Queue for high-priority round"
            if risk_level == "HIGH"
            else "Scheduled routine collection"
        )
    }
