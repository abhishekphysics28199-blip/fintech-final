<<<<<<< HEAD
## Fintech.AI (Prototype)

India-first financial safety assistant (multilingual) with a Next.js frontend and FastAPI backend.

### Run locally

#### Backend

1. Copy env:
   - `backend/.env.example` → `backend/.env`
2. Create venv + install:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend docs: `http://localhost:8000/docs`  
Health: `http://localhost:8000/health`

#### Frontend

```bash
cd frontend
npm install
$env:NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
npm run dev
```

Frontend: `http://localhost:3000`

### Notes

- All secrets must be provided via `.env` (never hardcode).
- If Gemini/Groq keys are missing, the chat endpoint uses a safe offline prototype response.
- WhatsApp sending requires Twilio WhatsApp Sandbox env vars.

=======
# Fintech-Ai
>>>>>>> cd7bd1f6120782eb6c511a7ec93892dd64415025
