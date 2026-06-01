# Backtrack — AI Beat Maker

Describe a beat in plain English. Claude interprets it into an optimized music prompt. Suno generates the audio. You hear it instantly.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| AI interpreter | Anthropic Claude (claude-sonnet-4-6) |
| Music generation | Apiframe → Suno |
| Deploy | Vercel (frontend) + Railway/Render (backend) |

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd "05 Backtrack Generator"

cd backend && npm install
cd ../frontend && npm install
```

### 2. Add your API keys

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
APIFRAME_API_KEY=...
PORT=3001
```

### 3. Run locally

**Terminal 1 — backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 — frontend:**
```bash
cd frontend && npm run dev
```

Open http://localhost:5173

---

## Usage

1. Type a beat description in the chat: *"dark trap beat, 140 BPM, A minor, heavy 808s, distorted hi-hats"*
2. Claude translates it into a Suno prompt
3. Suno generates the audio (~30–60 seconds)
4. The audio player loads — hit play
5. Type follow-up edits: *"make it brighter"*, *"add a piano melody"*, *"slow it to 120 BPM"*

---

## Deploy

### Backend (Railway — recommended)
1. Push to GitHub
2. New project → Deploy from GitHub → select `backend/` root
3. Add env vars: `ANTHROPIC_API_KEY`, `APIFRAME_API_KEY`
4. Copy the Railway URL

### Frontend (Vercel)
1. Update `frontend/vercel.json` — replace the `destination` with your Railway URL
2. `cd frontend && npx vercel --prod`
3. Add env var if needed (none required — keys stay on backend)

---

## Apiframe API notes

Backtrack uses these Apiframe endpoints:
- `POST https://api.apiframe.pro/suno-create` — submit generation job
- `GET https://api.apiframe.pro/fetch/{task_id}` — poll until complete

The backend polls every 5 seconds, times out after 3 minutes. If Apiframe changes their response shape, update the field extraction in `backend/server.js` in the `pollForAudio` function.
