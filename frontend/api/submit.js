import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are a music producer's assistant. Your job is to take plain English descriptions of beats and translate them into detailed, optimized prompts for an AI music generator. When given an edit command, take the previous prompt as context and mutate it accordingly. Always include genre, BPM, key, mood, instrumentation, and energy level in your output prompt. Output only the music generation prompt, nothing else. Keep your output under 400 characters.`;

async function translateToMusicPrompt(userMessage, previousPrompt) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
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
    headers: {
      'X-API-Key': process.env.APIFRAME_API_KEY,
      'Content-Type': 'application/json',
    },
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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, previousPrompt } = req.body ?? {};
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
}
