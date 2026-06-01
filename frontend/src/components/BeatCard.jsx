import { useEffect, useState } from 'react';

async function downloadMp3(audioUrl, filename) {
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
    // CORS fallback — open in new tab so user can save manually
    window.open(audioUrl, '_blank');
  }
}

// Parses key metadata values from the music prompt string
function parseMeta(prompt) {
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
    bpm: bpmMatch?.[1],
    key: keyMatch?.[1],
    genre: genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : null,
    mood: mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : null,
  };
}

export default function BeatCard({ beat, audioRef }) {
  const meta = parseMeta(beat.musicPrompt);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [beat.audioUrl]);

  async function handleExport() {
    setExporting(true);
    await downloadMp3(beat.audioUrl, `${(beat.label ?? 'Beat').replace(' ', '-')}.mp3`);
    setExporting(false);
  }

  return (
    <div style={styles.card}>
      {/* Header row: label + export */}
      <div style={styles.cardHeader}>
        <span style={styles.beatLabel}>{beat.label ?? 'Beat'}</span>
        <button onClick={handleExport} disabled={exporting} style={styles.exportBtn}>
          {exporting ? 'Downloading…' : '↓ Export MP3'}
        </button>
      </div>

      {/* Cover art or gradient placeholder */}
      <div style={styles.coverWrap}>
        {beat.imageUrl ? (
          <img src={beat.imageUrl} alt="Beat cover" style={styles.coverImg} />
        ) : (
          <div style={styles.coverPlaceholder}>
            <span style={styles.coverIcon}>🎹</span>
          </div>
        )}
      </div>

      {/* Meta tags row */}
      <div style={styles.metaRow}>
        {meta.genre && <MetaChip label="Genre" value={meta.genre} />}
        {meta.bpm && <MetaChip label="BPM" value={meta.bpm} accent />}
        {meta.key && <MetaChip label="Key" value={meta.key} />}
        {meta.mood && <MetaChip label="Mood" value={meta.mood} />}
      </div>

      {/* Prompt display */}
      <div style={styles.promptBox}>
        <p style={styles.promptLabel}>Music Prompt</p>
        <p style={styles.promptText}>{beat.musicPrompt}</p>
      </div>
    </div>
  );
}

function MetaChip({ label, value, accent }) {
  return (
    <div style={{
      ...styles.chip,
      background: accent ? 'var(--accent-glow)' : 'var(--bg-hover)',
      border: `1px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
    }}>
      <span style={styles.chipLabel}>{label}</span>
      <span style={{
        ...styles.chipValue,
        color: accent ? 'var(--accent)' : 'var(--text-primary)',
      }}>{value}</span>
    </div>
  );
}

const styles = {
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  beatLabel: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.2px',
  },
  exportBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.02em',
  },
  card: {
    width: '100%',
    maxWidth: 560,
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  coverWrap: {
    width: '100%',
    aspectRatio: '16/7',
    borderRadius: 10,
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a1a35 0%, #0d0d20 50%, #1a0d30 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverIcon: {
    fontSize: 52,
    filter: 'drop-shadow(0 0 20px var(--accent))',
  },
  metaRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    display: 'flex',
    flexDirection: 'column',
    padding: '6px 12px',
    borderRadius: 8,
    gap: 1,
  },
  chipLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 600,
  },
  chipValue: {
    fontSize: 14,
    fontWeight: 600,
  },
  promptBox: {
    background: 'var(--bg-surface)',
    borderRadius: 10,
    padding: '14px 16px',
    border: '1px solid var(--border)',
  },
  promptLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 600,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    fontFamily: "'JetBrains Mono', monospace",
  },
};
