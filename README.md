# Backtrack — AI Beat Studio

> Describe a beat in plain English. Claude interprets it. Suno builds it. You hear it in minutes.

Backtrack is a full-stack AI music production app that turns natural language into fully-generated audio tracks. Type something like *"dark trap, 140 BPM, A minor, heavy 808s"* — and within a couple minutes you have a real audio file you can play, iterate on, and export.

---

## How App Works

```
User types a prompt
      ↓
Claude (claude-sonnet-4-6) translates it into an optimized Suno prompt
      ↓
Apiframe submits the job to Suno V4
      ↓
Backend polls until complete (~90–120s)
      ↓
Audio + AI-generated cover art returned to the UI
      ↓
Play, iterate, or export as MP3
```

Every follow-up message is context-aware — say *"make it brighter"* or *"add a piano melody"* and Claude mutates the previous prompt rather than starting from scratch.

---

## Features

- **Natural language beat generation** — describe it however you want, Claude figures out the rest
- **Iterative editing** — follow-up commands mutate the previous prompt, preserving context
- **Beat versioning** — up to 3 beats tracked in parallel tabs, switch between them freely
- **MP3 export** — download any beat directly from the tab bar
- **AI cover art** — each beat gets a unique AI-generated image representing the vibe
- **Controls panel** — BPM slider, Energy (Low / Medium / High), Sonic Mood toggles feed into Claude on regenerate
- **Deep space UI** — built with the Cinematic Deep Space design system: glassmorphism panels, Sora/JetBrains Mono typography, animated galaxy on the landing screen

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Styling | CSS-in-JS with Cinematic Deep Space design tokens |
| Backend | Node.js + Express |
| AI Interpreter | Anthropic Claude (`claude-sonnet-4-6`) |
| Music Generation | Apiframe → Suno V4 (instrumental) |
| Fonts | Sora · Inter · JetBrains Mono |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## Local Setup

### 1. Clone & install

```bash
git clone https://github.com/ethandfang/Backtrack.git
cd Backtrack

cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables

Create `backend/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...
APIFRAME_API_KEY=afk_...
PORT=3001
```

You'll need:
- **Anthropic API key** — [console.anthropic.com](https://console.anthropic.com)
- **Apiframe API key** — [apiframe.ai](https://apiframe.ai) (used to access Suno)

### 3. Run locally

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

Backtrack uses a split deployment: the **frontend on Vercel** and the **backend on Railway**. This keeps API keys secure on the server and lets each layer scale independently.

### Step 1 — Deploy the backend to Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Choose **Deploy from GitHub repo** → select `Backtrack`
3. Set the **root directory** to `backend`
4. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `APIFRAME_API_KEY`
   - `PORT` → Railway sets this automatically, you can leave it out
5. Deploy — Railway gives you a URL like `https://backtrack-backend-production.up.railway.app`

### Step 2 — Configure the frontend for production

Update `frontend/vercel.json` — replace the destination with your Railway URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-railway-url.up.railway.app/api/:path*"
    }
  ]
}
```

This proxies all `/api/*` calls from the Vercel frontend to your Railway backend, so no API keys ever touch the client.

### Step 3 — Deploy the frontend to Vercel

```bash
cd frontend
npx vercel --prod
```

Or connect through the Vercel dashboard:
1. [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **root directory** to `frontend`
3. Framework preset: **Vite**
4. No environment variables needed on the frontend (keys stay on Railway)
5. Deploy

---

## Project Structure

```
Backtrack/
├── backend/
│   ├── server.js          # Express API — Claude + Apiframe/Suno logic
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Root — state, API calls, layout
│   │   └── components/
│   │       ├── ChatSidebar.jsx        # Left panel — chat + Generate New Beat
│   │       ├── AudioPlayer.jsx        # Waveform player with animated bars
│   │       ├── BeatControls.jsx       # BPM / Energy / Mood controls
│   │       ├── BeatTabs.jsx           # Beat versioning tabs + MP3 download
│   │       ├── LoadingVisualizer.jsx  # Galaxy swirl animation during generation
│   │       └── BeatCard.jsx           # Utilities: parseMeta, downloadMp3
│   ├── vercel.json                    # API proxy rewrite for production
│   └── package.json
└── stitch-design/                     # Original Stitch UI exports (reference)
```

---

## Generation Notes

- Beats are generated as **instrumental** tracks — no AI vocals, optimized for beat-making
- Average generation time is **90–120 seconds** depending on Suno server load
- The backend polls every 5 seconds with a 6-minute timeout
- Prompts are capped at 490 characters (Apiframe's limit is 500)
- Follow-up edits pass the previous prompt as context so Claude only mutates what you asked to change
