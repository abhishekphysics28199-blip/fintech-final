"""
Rule-based fraud pattern matching + structured advice (NPCI/RBI/SEBI/IRDAI themes).
Used as CONTEXT for the LLM, not as the direct reply. Improved matching to avoid
false positives (e.g., "demat account" should NOT match UPI patterns).
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

_DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "npci_fraud_patterns"
_PATTERNS_FILE = _DATA_DIR / "patterns.json"

# Topic buckets for fallback routing — ordered from most to least specific
_TOPIC_BUCKETS: list[tuple[tuple[str, ...], str, str]] = [
    (
        ("demat", "depository", "cdsl", "nsdl", "dp account", "demat account"),
        "demat",
        "**Demat Account Issue:** Contact your Depository Participant (DP/broker) first. "
        "For unauthorized demat transactions, file with **CDSL**: https://www.cdslindia.com/Investors/Grievances.html "
        "or **NSDL**: https://nsdl.co.in/investor-grievance.php. "
        "Also file with **SEBI SCORES**: https://scores.sebi.gov.in | Helpline: **14440**.",
    ),
    (
        ("broker", "trading account", "stock broker", "trading app", "zerodha", "groww", "upstox", "angel", "m stock"),
        "broker",
        "**Broker / Trading Account Issue:** First raise a ticket with your broker's grievance cell. "
        "If unresolved in 30 days, escalate to **SEBI SCORES**: https://scores.sebi.gov.in | "
        "NSE Investor Service: https://investorhelpline.nseindia.com | Helpline: **14440**.",
    ),
    (
        ("upi", "gpay", "google pay", "phonepe", "phone pe", "paytm", "bhim", "upi id", "upi pin"),
        "upi",
        "**UPI Issue Detected:** If money moved without consent — call your bank immediately, "
        "note the transaction UTR ID, and report at **cybercrime.gov.in** or call **1930**. "
        "Also raise a dispute at **NPCI**: https://www.npci.org.in/dispute-redressal",
    ),
    (
        ("sebi", "mutual fund", "sip", "ipo", "nfo", "portfolio", "investment fraud", "stock", "share"),
        "sebi",
        "**SEBI / Investment Issue:** Verify all intermediaries at sebi.gov.in. "
        "File complaints at **SEBI SCORES**: https://scores.sebi.gov.in | Helpline: **14440**.",
    ),
    (
        ("rbi", "bank", "credit card", "savings account", "current account", "nbfc", "fixed deposit"),
        "banking",
        "**Banking / RBI Issue:** For unauthorized transactions or grievances, use "
        "**RBI CMS**: https://cms.rbi.org.in | For cyber fraud also call **1930** and report at **cybercrime.gov.in**.",
    ),
    (
        ("insurance", "irdai", "policy", "premium", "claim", "life insurance", "health insurance"),
        "insurance",
        "**Insurance Issue:** Verify agent/insurer at IRDAI. "
        "File complaints: **Bima Bharosa**: https://bimabharosa.irdai.gov.in | Helpline: **1800-11-0001**.",
    ),
    (
        ("loan app", "instant loan", "digital loan", "personal loan app", "harassment", "recovery agent", "loan fraud"),
        "loan_app",
        "**Loan App / Digital Lending Issue:** Only borrow from RBI-registered lenders. "
        "For harassment, report to **cybercrime.gov.in** and your state police. "
        "Check RBI-registered NBFCs: https://www.rbi.org.in",
    ),
]


def _load_patterns() -> list[dict[str, Any]]:
    if not _PATTERNS_FILE.is_file():
        return []
    with open(_PATTERNS_FILE, encoding="utf-8") as f:
        return json.load(f)


def _get_exclusive_topic(text: str) -> str | None:
    """
    Detect if the text is EXCLUSIVELY about a specific topic that should
    NOT trigger generic UPI/bank patterns. Returns topic key or None.
    """
    t = text.lower()
    # Demat-exclusive signals (no UPI keywords present)
    demat_signals = ("demat", "depository", "cdsl", "nsdl", "dp account")
    upi_signals = ("upi", "gpay", "google pay", "phonepe", "paytm", "bhim")

    if any(d in t for d in demat_signals) and not any(u in t for u in upi_signals):
        return "demat_exclusive"
    return None


def _heuristic_compromise(text: str) -> bool:
    """UPI/bank distress heuristic — only fires when UPI ecosystem words are present."""
    t = text.lower()

    # Must have a UPI-specific term (not just 'bank')
    upi_specific = (
        "upi", "gpay", "google pay", "phonepe", "phone pe",
        "paytm", "bhim", "upi id", "upi pin", "collect request",
    )
    distress = (
        "hack", "hacked", "stolen", "fraud", "fraudster", "unauthorized",
        "unknown transaction", "debited without", "drained", "lost money",
        "money gone", "scam", "cheat", "compromised",
    )

    has_upi = any(u in t for u in upi_specific)
    has_distress = any(d in t for d in distress)

    # Explicitly exclude demat-only mentions
    exclusive = _get_exclusive_topic(t)
    if exclusive == "demat_exclusive":
        return False

    return has_upi and has_distress


def match_fraud_patterns(text: str) -> list[dict[str, Any]]:
    """Return matching pattern dicts (0..3) by keyword scoring with topic exclusion."""
    t = (text or "").lower()
    if not t.strip():
        return []

    # If the message is demat-exclusive, skip all UPI/bank patterns
    exclusive_topic = _get_exclusive_topic(t)

    patterns = _load_patterns()
    by_id = {p.get("id"): p for p in patterns}
    scored: list[tuple[int, dict[str, Any]]] = []

    for p in patterns:
        # Skip UPI/bank patterns for demat-exclusive queries
        if exclusive_topic == "demat_exclusive" and p.get("id") in (
            "upi_account_compromise", "upi_phishing", "qr_scam", "sim_swap", "fake_kyc"
        ):
            continue

        score = 0
        for kw in p.get("keywords", []):
            kl = kw.lower()
            if kl in t:
                score += 2 + min(len(kl) // 12, 2)

        # Title word match (minor boost)
        title = (p.get("title") or "").lower()
        if title and any(w in t for w in re.findall(r"\w+", title) if len(w) > 4):
            score += 1

        if score > 0:
            scored.append((score, p))

    # UPI compromise heuristic
    if _heuristic_compromise(t):
        comp = by_id.get("upi_account_compromise")
        if comp:
            current_max = max((s for s, _ in scored), default=0)
            scored.append((current_max + 3, comp))

    scored.sort(key=lambda x: -x[0])

    # De-duplicate by id, keep top 3
    seen: set[str] = set()
    out: list[dict[str, Any]] = []
    for _, p in scored:
        pid = str(p.get("id", ""))
        if pid and pid not in seen:
            seen.add(pid)
            out.append(p)
        if len(out) >= 3:
            break
    return out


def _fallback_for_text(text: str, lang: str) -> str:
    """Topic-aware fallback when no pattern matches exactly."""
    t = (text or "").lower()

    for keywords, topic_key, guidance in _TOPIC_BUCKETS:
        if any(kw in t for kw in keywords):
            if lang.startswith("hi"):
                return f"**संक्षेप में:** आपकी समस्या के अनुसार जानकारी नीचे है।\n\n{guidance}"
            return guidance

    # Generic fallback
    if lang.startswith("hi"):
        return (
            "**सामान्य वित्तीय सुरक्षा सुझाव:**\n"
            "• OTP, पासवर्ड या पिन किसी से साझा न करें\n"
            "• साइबर फ्रॉड रिपोर्ट: **cybercrime.gov.in** | हेल्पलाइन: **1930**\n"
            "• अपने बैंक का आधिकारिक नंबर वेबसाइट से लें, WhatsApp/SMS से नहीं"
        )
    return (
        "**General Financial Safety:**\n"
        "• Never share OTPs, passwords, or PINs with anyone\n"
        "• Report cyber fraud: **cybercrime.gov.in** | Helpline: **1930**\n"
        "• Always get your bank's number from their official website, not SMS/WhatsApp"
    )


def build_structured_reply(matches: list[dict[str, Any]], lang: str, user_text: str = "") -> str:
    """
    Build structured guidance block.
    This is used as LLM grounding context — and as direct fallback if LLM is unavailable.
    """
    if not matches:
        return _fallback_for_text(user_text, lang)

    primary = matches[0]
    related = ""
    if len(matches) > 1:
        related = "\n\n**Related concerns also detected:** " + ", ".join(
            m["title"] for m in matches[1:]
        )

    complaint_links = primary.get("complaint_links", [])
    links_block = "\n".join(f"• {u}" for u in complaint_links)

    block = (
        f"**Detected issue:** {primary.get('title', 'Fraud pattern')}\n\n"
        f"**What's happening:** {primary.get('summary', '')}\n\n"
        f"**Immediate steps:** {primary.get('solution', '')}\n\n"
        f"**Regulatory context:** {primary.get('source_hint', '')}\n\n"
        f"**Where to complain:**\n"
        f"{links_block}\n"
        f"• National Cyber Crime Helpline: **1930** (24×7)"
        f"{related}"
    )

    if lang.startswith("hi"):
        block = (
            f"**संभावित समस्या:** {primary.get('title', '')}\n\n" + block
        )
    return block
