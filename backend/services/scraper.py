from __future__ import annotations

import json
import time
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from database import ScamAlert

SEED_PATH = Path(__file__).resolve().parents[1] / "data" / "seed_scams.json"


def _respectful_get(url: str) -> str:
    time.sleep(2)
    r = requests.get(
        url,
        headers={
            "User-Agent": "Fintech.AI Prototype (educational) - contact: Abhishek Tiwari",
            "Accept": "text/html,application/xhtml+xml",
        },
        timeout=20,
    )
    r.raise_for_status()
    return r.text


def refresh_from_seed(db: Session) -> int:
    if not SEED_PATH.exists():
        return 0
    items = json.loads(SEED_PATH.read_text(encoding="utf-8"))
    count = 0
    for it in items:
        db.add(
            ScamAlert(
                title=it["title"],
                description=it["description"],
                scam_type=it["scam_type"],
                severity=it["severity"],
                affected_states=it["affected_states"],
                source_url=it["source_url"],
                source_name=it["source_name"],
                fetched_at=datetime.utcnow(),
                is_active=True,
            )
        )
        count += 1
    db.commit()
    return count


def refresh_from_official_sources(_: Session) -> int:
    """
    Prototype stub.
    Hook your parsers here (RBI/SEBI/NPCI/IRDAI/NCRP) and upsert into DB + vector store.
    """
    # Example snippet kept tiny and safe.
    try:
        html = _respectful_get("https://cybercrime.gov.in")
        _ = BeautifulSoup(html, "html.parser")
        return 0
    except Exception:
        return 0

