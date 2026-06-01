import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a music producer's assistant. Your job is to take plain English descriptions of beats and translate them into detailed, optimized prompts for an AI music generator. When given an edit command, take the previous prompt as context and mutate it accordingly. Always include genre, BPM, key, mood, instrumentation, and energy level in your output prompt. Output only the music generation prompt, nothing else. Keep your output under 400 characters.`;

async function translateToMusicPrompt(userMessage, previousPrompt) {
  const messages = [];
  if (previousPrompt) {
    messages.push({
      role: 'user',
      content: `Previous music prompt: ${previousPrompt}\n\nEdit command: ${userMessage}\n\nMake only the changes the user asked for. Preserve everything else about the previous prompt. Do not start from scratch.`,
    });
  } else {
    messages.push({ role: 'user', content: userMessage });
  }
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });
  return response.content[0].text.trim();
}

async function submitSunoJob(prompt) {
  const response = await fetch('https://api.apiframe.ai/v2/music/generate', {
    method: 'POST',
    headers: { 'X-API-Key': process.env.APIFRAME_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'suno',
      prompt,
      sunoParams: { custom_mode: false, instrumental: true, model_version: 'V4' },
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Apiframe submit failed: ${response.status} ${err}`);
  }
  const data = await response.json();
  const taskId = data.task_id ?? data.taskId ?? data.jobId ?? data.id;
  if (!taskId) throw new Error(`No task_id in Apiframe response: ${JSON.stringify(data)}`);
  return taskId;
}

function deepFind(obj, key) {
  if (!obj || typeof obj !== 'object') return undefined;
  if (key in obj) return obj[key];
  for (const v of Object.values(obj)) {
    const found = deepFind(v, key);
    if (found) return found;
  }
  return undefined;
}

// POST /api/submit — translate + submit to Suno
app.post('/api/submit', async (req, res) => {
  const { message, previousPrompt } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'message is required' });
  try {
    const rawPrompt = await translateToMusicPrompt(message, previousPrompt);
    const musicPrompt = rawPrompt.slice(0, 490);
    const taskId = await submitSunoJob(musicPrompt);
    res.json({ musicPrompt, taskId });
  } catch (err) {
    console.error('[/api/submit]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/poll?taskId=xxx — single status check
app.get('/api/poll', async (req, res) => {
  const { taskId } = req.query;
  if (!taskId) return res.status(400).json({ error: 'taskId is required' });
  try {
    const response = await fetch(`https://api.apiframe.ai/v2/jobs/${taskId}`, {
      headers: { 'X-API-Key': process.env.APIFRAME_API_KEY },
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Apiframe poll failed: ${response.status} ${err}`);
    }
    const data = await response.json();
    const status = (data.status ?? '').toLowerCase();
    console.log(`[poll] status=${data.status}`);

    if (status === 'completed' || status === 'finished' || status === 'success' || status === 'done') {
      const track = data.tracks?.[0] ?? data.songs?.[0];
      const audioUrl = track?.audioUrl ?? track?.audio_url ?? deepFind(data, 'audioUrl') ?? deepFind(data, 'audio_url');
      const imageUrl = track?.imageUrl ?? track?.image_url ?? deepFind(data, 'imageUrl') ?? deepFind(data, 'image_url') ?? null;
      if (!audioUrl) throw new Error(`No audio_url in completed response`);
      return res.json({ status: 'complete', audioUrl, imageUrl });
    }
    if (status === 'failed' || status === 'error') return res.json({ status: 'failed' });
    res.json({ status: 'processing' });
  } catch (err) {
    console.error('[/api/poll]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => console.log(`Backtrack backend running on http://localhost:${port}`));
