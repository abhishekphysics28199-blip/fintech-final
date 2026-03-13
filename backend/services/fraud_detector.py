from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

try:
    import joblib  # type: ignore
except Exception:  # pragma: no cover
    joblib = None


@dataclass
class FraudResult:
    risk_score: float
    is_fraud: bool


MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "fraud_model.pkl"
_model = None


def load_model():
    global _model
    if _model is not None:
        return _model
    if MODEL_PATH.exists() and joblib is not None:
        _model = joblib.load(MODEL_PATH)
    else:
        _model = None
    return _model


def check_fraud(
    transaction_amount: float | None,
    platform: str | None,
    recipient_type: str | None = None,
    device_type: str | None = None,
    state: str | None = None,
) -> FraudResult:
    model = load_model()
    if model is None:
        # Conservative heuristic for prototype.
        score = 0.1
        if transaction_amount and transaction_amount >= 10000:
            score += 0.4
        if platform and platform.upper() in {"UPI", "IMPS"}:
            score += 0.2
        if recipient_type and recipient_type.lower() in {"unknown", "merchant-unknown"}:
            score += 0.2
        score = min(score, 0.95)
        return FraudResult(risk_score=score, is_fraud=score >= 0.7)

    # If you supply a trained model, map features accordingly.
    # Here we keep it simple (model integration can be expanded).
    score = 0.5
    return FraudResult(risk_score=score, is_fraud=score >= 0.7)

