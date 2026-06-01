function deepFind(obj, key) {
  if (!obj || typeof obj !== 'object') return undefined;
  if (key in obj) return obj[key];
  for (const v of Object.values(obj)) {
    const found = deepFind(v, key);
    if (found) return found;
  }
  return undefined;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { taskId } = req.query ?? {};
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

    if (status === 'completed' || status === 'finished' || status === 'success' || status === 'done') {
      const track = data.tracks?.[0] ?? data.songs?.[0];
      const audioUrl =
        track?.audioUrl ?? track?.audio_url ??
        deepFind(data, 'audioUrl') ?? deepFind(data, 'audio_url');
      const imageUrl =
        track?.imageUrl ?? track?.image_url ??
        deepFind(data, 'imageUrl') ?? deepFind(data, 'image_url') ?? null;
      if (!audioUrl) throw new Error(`No audio_url in completed response`);
      return res.json({ status: 'complete', audioUrl, imageUrl });
    }

    if (status === 'failed' || status === 'error') {
      return res.json({ status: 'failed' });
    }

    res.json({ status: 'processing' });
  } catch (err) {
    console.error('[/api/poll]', err.message);
    res.status(500).json({ error: err.message });
  }
}
