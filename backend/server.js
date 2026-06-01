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

// Translate user message into a Suno-optimized prompt via Claude
async function translateToMusicPrompt(userMessage, previousPrompt) {
  const messages = [];

  if (previousPrompt) {
    messages.push({
      role: 'user',
      content: `Previous music prompt: ${previousPrompt}\n\nEdit command: ${userMessage}`,
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

// Submit a song generation job to Apiframe v2 Suno
async function submitSunoJob(prompt) {
  const response = await fetch('https://api.apiframe.ai/v2/music/generate', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.APIFRAME_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'suno',
      prompt,
      sunoParams: { custom_mode: false, instrumental: false, model_version: 'V5' },
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

// Recursively find a value by key anywhere in a nested object
function deepFind(obj, key) {
  if (!obj || typeof obj !== 'object') return undefined;
  if (key in obj) return obj[key];
  for (const v of Object.values(obj)) {
    const found = deepFind(v, key);
    if (found) return found;
  }
  return undefined;
}

// Poll Apiframe v2 until audio is ready (max ~3 minutes)
async function pollForAudio(taskId) {
  const maxAttempts = 36; // 36 * 5s = 3 min
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  for (let i = 0; i < maxAttempts; i++) {
    await delay(5000);

    const response = await fetch(`https://api.apiframe.ai/v2/jobs/${taskId}`, {
      headers: { 'X-API-Key': process.env.APIFRAME_API_KEY },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Apiframe fetch failed: ${response.status} ${err}`);
    }

    const data = await response.json();
    const status = (data.status ?? '').toLowerCase();
    console.log(`[poll ${i + 1}] status=${data.status} keys=${Object.keys(data)}`);

    if (status === 'completed' || status === 'finished' || status === 'success' || status === 'done') {
      console.log('[poll] completed data:', JSON.stringify(data).slice(0, 500));
      const track = data.tracks?.[0] ?? data.songs?.[0];
      const audioUrl =
        track?.audioUrl ?? track?.audio_url ??
        deepFind(data, 'audioUrl') ?? deepFind(data, 'audio_url');
      const imageUrl =
        track?.imageUrl ?? track?.image_url ??
        deepFind(data, 'imageUrl') ?? deepFind(data, 'image_url') ?? null;
      if (!audioUrl) throw new Error(`No audio_url in completed response: ${JSON.stringify(data)}`);
      return { audioUrl, imageUrl };
    }

    if (status === 'failed' || status === 'error') {
      throw new Error(`Suno generation failed: ${JSON.stringify(data)}`);
    }
  }

  throw new Error('Suno generation timed out after 3 minutes');
}

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, previousPrompt } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    // Step 1: Claude translates the user message into a music prompt
    const rawPrompt = await translateToMusicPrompt(message, previousPrompt);
    const musicPrompt = rawPrompt.slice(0, 490); // Apiframe hard limit is 500 chars

    // Step 2: Submit to Apiframe Suno
    const taskId = await submitSunoJob(musicPrompt);

    // Step 3: Poll until audio is ready
    const { audioUrl, imageUrl } = await pollForAudio(taskId);

    res.json({ musicPrompt, audioUrl, imageUrl, taskId });
  } catch (err) {
    console.error('[/api/chat error]', err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`Backtrack backend running on http://localhost:${port}`);
});
