from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from config import add_ownership_watermark
from database import FraudCheck, get_db
from services.fraud_detector import check_fraud

router = APIRouter(prefix="/api", tags=["fraud"])


class FraudCheckIn(BaseModel):
    session_id: str | None = None
    transaction_amount: float | None = None
    platform: str | None = None
    recipient_type: str | None = None
    device_type: str | None = None
    state: str | None = None


@router.post("/fraud-check")
def fraud_check(payload: FraudCheckIn, db: Session = Depends(get_db)):
    r = check_fraud(
        transaction_amount=payload.transaction_amount,
        platform=payload.platform,
        recipient_type=payload.recipient_type,
        device_type=payload.device_type,
        state=payload.state,
    )
    db.add(
        FraudCheck(
            session_id=payload.session_id,
            transaction_amount=payload.transaction_amount,
            platform=payload.platform,
            risk_score=r.risk_score,
            is_fraud=r.is_fraud,
        )
    )
    db.commit()
    return add_ownership_watermark({"risk_score": r.risk_score, "is_fraud": r.is_fraud})

