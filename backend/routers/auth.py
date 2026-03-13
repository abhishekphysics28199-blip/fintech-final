from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from config import JWT_ALGORITHM, JWT_EXPIRES_MINUTES, JWT_SECRET, add_ownership_watermark
from database import User, get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterIn(BaseModel):
    name: str | None = None
    phone: str
    password: str
    preferred_language: str | None = None
    state: str | None = None


class LoginIn(BaseModel):
    phone: str
    password: str


def _create_token(user_id: int) -> str:
    exp = datetime.utcnow() + timedelta(minutes=JWT_EXPIRES_MINUTES)
    payload = {"sub": str(user_id), "exp": exp}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


@router.post("/register")
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.phone == payload.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already registered")

    user = User(
        name=payload.name,
        phone=payload.phone,
        password_hash=pwd.hash(payload.password),
        preferred_language=payload.preferred_language or "English",
        state=payload.state,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = _create_token(user.id)
    return add_ownership_watermark({"token": token, "user": {"id": user.id, "phone": user.phone}})


@router.post("/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == payload.phone).first()
    if not user or not pwd.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = _create_token(user.id)
    return add_ownership_watermark({"token": token, "user": {"id": user.id, "phone": user.phone}})

