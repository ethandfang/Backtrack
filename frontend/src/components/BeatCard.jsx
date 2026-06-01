// Utility exports used by BeatTabs and SessionPanel

export async function downloadMp3(audioUrl, filename) {
  try {
    const res = await fetch(audioUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    window.open(audioUrl, '_blank');
  }
}

export function parseMeta(prompt) {
  if (!prompt) return {};
  const bpmMatch = prompt.match(/\b(\d{2,3})\s*(?:BPM|bpm)/);
  const keyMatch = prompt.match(/\b([A-G][#b]?\s*(?:major|minor|maj|min))\b/i);

  const genreKeywords = [
    'trap', 'hip-hop', 'hiphop', 'lo-fi', 'lofi', 'drill', 'r&b', 'rnb',
    'house', 'techno', 'ambient', 'jazz', 'afrobeats', 'dancehall', 'pop',
    'soul', 'boom bap', 'uk drill', 'phonk', 'cloud rap',
  ];
  const lower = prompt.toLowerCase();
  const genre = genreKeywords.find((g) => lower.includes(g));

  const moodKeywords = [
    'dark', 'light', 'bright', 'aggressive', 'chill', 'melancholic',
    'energetic', 'dreamy', 'hard', 'soft', 'sad', 'upbeat', 'gritty',
    'nostalgic', 'euphoric',
  ];
  const mood = moodKeywords.find((m) => lower.includes(m));

  return {
    bpm: bpmMatch?.[1] ?? null,
    key: keyMatch?.[1] ?? null,
    genre: genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : null,
    mood: mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : null,
  };
}

export default function BeatCard() { return null; }
