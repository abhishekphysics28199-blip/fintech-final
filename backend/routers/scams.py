from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config import add_ownership_watermark
from database import ScamAlert, get_db
from services.scraper import refresh_from_seed

router = APIRouter(prefix="/api/scams", tags=["scams"])


@router.get("/trending")
def trending(db: Session = Depends(get_db)):
    items = (
        db.query(ScamAlert)
        .filter(ScamAlert.is_active == True)  # noqa: E712
        .order_by(ScamAlert.fetched_at.desc())
        .limit(20)
        .all()
    )
    if not items:
        refresh_from_seed(db)
        items = (
            db.query(ScamAlert)
            .filter(ScamAlert.is_active == True)  # noqa: E712
            .order_by(ScamAlert.fetched_at.desc())
            .limit(20)
            .all()
        )

    return add_ownership_watermark({"items": [serialize(x) for x in items]})


@router.get("/by-state")
def by_state(state: str, db: Session = Depends(get_db)):
    q = (
        db.query(ScamAlert)
        .filter(ScamAlert.is_active == True)  # noqa: E712
        .filter(ScamAlert.affected_states.ilike(f"%{state}%"))
        .order_by(ScamAlert.fetched_at.desc())
        .limit(50)
        .all()
    )
    return add_ownership_watermark({"items": [serialize(x) for x in q]})


def serialize(x: ScamAlert) -> dict:
    return {
        "id": x.id,
        "title": x.title,
        "description": x.description,
        "scam_type": x.scam_type,
        "severity": x.severity,
        "affected_states": x.affected_states,
        "source_url": x.source_url,
        "source_name": x.source_name,
        "fetched_at": x.fetched_at.isoformat(),
    }

