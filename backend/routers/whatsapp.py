from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER, add_ownership_watermark

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])


class WhatsAppIn(BaseModel):
    to: str = Field(min_length=8, max_length=32)
    text: str = Field(min_length=1, max_length=4000)
    language_code: str = Field(default="en", max_length=10)


@router.post("/send")
def send(payload: WhatsAppIn):
    if not (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_WHATSAPP_NUMBER):
        raise HTTPException(
            status_code=400,
            detail="Twilio WhatsApp is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER.",
        )

    try:
        from twilio.rest import Client

        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        msg = client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            to=f"whatsapp:{payload.to}" if not payload.to.startswith("whatsapp:") else payload.to,
            body=payload.text,
        )
        return add_ownership_watermark({"ok": True, "sid": msg.sid})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"WhatsApp send failed: {e}")

