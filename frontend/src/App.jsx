import { useState, useRef } from 'react';
import ChatSidebar from './components/ChatSidebar.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import BeatCard from './components/BeatCard.jsx';
import LoadingVisualizer from './components/LoadingVisualizer.jsx';
import BeatControls from './components/BeatControls.jsx';
import BeatTabs from './components/BeatTabs.jsx';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [beats, setBeats] = useState([]);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [previousPrompt, setPreviousPrompt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [controls, setControls] = useState({ bpm: 120, energy: 'medium', moods: [] });
  const audioRef = useRef(null);
  const beatCountRef = useRef(0);

  const currentBeat = beats[activeBeatIndex] ?? null;

  // Core generation — called by both chat sends and controls regenerate
  async function callApi(userMessage) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, previousPrompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Unknown server error');

    beatCountRef.current += 1;
    const beat = {
      id: Date.now(),
      label: `Beat ${beatCountRef.current}`,
      audioUrl: data.audioUrl,
      imageUrl: data.imageUrl,
      musicPrompt: data.musicPrompt,
      controls: { ...controls },
    };

    setBeats((prev) => {
      const next = [...prev, beat];
      setActiveBeatIndex(next.length - 1);
      return next;
    });
    setPreviousPrompt(data.musicPrompt);
    return beat;
  }

  // Chat send
  async function handleSend(userMessage) {
    if (!userMessage.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    try {
      const beat = await callApi(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: beat.musicPrompt, beat }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'error', content: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  // Controls regenerate — builds a natural language command from the sliders/toggles
  async function handleRegenerate() {
    if (loading) return;
    const moodStr = controls.moods.length > 0 ? `, moods: ${controls.moods.join(', ')}` : '';
    const msg = `Adjust to ${controls.bpm} BPM, ${controls.energy} energy${moodStr}`;
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const beat = await callApi(msg);
      setMessages((prev) => [...prev, { role: 'assistant', content: beat.musicPrompt, beat }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'error', content: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  // Clicking "Load this beat" in the chat sidebar
  function handleSelectBeat(beat) {
    const idx = beats.findIndex((b) => b.id === beat.id);
    if (idx !== -1) setActiveBeatIndex(idx);
  }

  return (
    <div style={styles.layout}>
      <ChatSidebar
        messages={messages}
        loading={loading}
        onSend={handleSend}
        onSelectBeat={handleSelectBeat}
      />

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>▶</span>
            <span style={styles.logoText}>Backtrack</span>
          </div>
          <p style={styles.tagline}>AI-Powered Beat Maker</p>
        </header>

        <BeatTabs beats={beats} activeBeatIndex={activeBeatIndex} onSelect={setActiveBeatIndex} />

        <div style={styles.playerArea}>
          {loading ? (
            <LoadingVisualizer />
          ) : currentBeat ? (
            <BeatCard beat={currentBeat} audioRef={audioRef} />
          ) : (
            <EmptyState />
          )}
        </div>

        {currentBeat && !loading && (
          <AudioPlayer audioRef={audioRef} audioUrl={currentBeat.audioUrl} />
        )}

        <BeatControls
          controls={controls}
          onChange={setControls}
          onRegenerate={handleRegenerate}
          loading={loading}
          hasBeat={beats.length > 0}
        />
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>🎵</div>
      <h2 style={styles.emptyTitle}>Describe your beat</h2>
      <p style={styles.emptyBody}>
        Type something like <em style={{ color: 'var(--accent)' }}>"dark trap beat, 140 BPM, minor key, heavy 808s"</em> in the chat and Backtrack will generate it for you.
      </p>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-base)',
    overflow: 'hidden',
  },
  header: {
    padding: '20px 32px 0',
    display: 'flex',
    alignItems: 'baseline',
    gap: 16,
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    fontSize: 20,
    color: 'var(--accent)',
    filter: 'drop-shadow(0 0 8px var(--accent))',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '-0.5px',
    color: 'var(--text-primary)',
  },
  tagline: {
    fontSize: 12,
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  playerArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 32px',
    overflow: 'hidden',
  },
  emptyState: {
    textAlign: 'center',
    maxWidth: 420,
    padding: '0 16px',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    filter: 'grayscale(0.3)',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 12,
    color: 'var(--text-primary)',
  },
  emptyBody: {
    fontSize: 15,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
};
