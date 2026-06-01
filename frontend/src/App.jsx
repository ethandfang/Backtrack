import { useState, useRef } from 'react';
import ChatSidebar from './components/ChatSidebar.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import BeatCard from './components/BeatCard.jsx';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [currentBeat, setCurrentBeat] = useState(null); // { audioUrl, imageUrl, musicPrompt }
  const [previousPrompt, setPreviousPrompt] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  async function handleSend(userMessage) {
    if (!userMessage.trim() || loading) return;

    const userMsg = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, previousPrompt }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Unknown server error');

      const beat = {
        audioUrl: data.audioUrl,
        imageUrl: data.imageUrl,
        musicPrompt: data.musicPrompt,
      };

      setCurrentBeat(beat);
      setPreviousPrompt(data.musicPrompt);

      const assistantMsg = {
        role: 'assistant',
        content: data.musicPrompt,
        beat,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'error', content: err.message },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.layout}>
      {/* Left: Chat sidebar */}
      <ChatSidebar
        messages={messages}
        loading={loading}
        onSend={handleSend}
        onSelectBeat={(beat) => setCurrentBeat(beat)}
      />

      {/* Right: Player + beat info */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>▶</span>
            <span style={styles.logoText}>Backtrack</span>
          </div>
          <p style={styles.tagline}>AI-Powered Beat Maker</p>
        </header>

        <div style={styles.playerArea}>
          {currentBeat ? (
            <BeatCard beat={currentBeat} audioRef={audioRef} />
          ) : (
            <EmptyState />
          )}
        </div>

        {currentBeat && (
          <AudioPlayer audioRef={audioRef} audioUrl={currentBeat.audioUrl} />
        )}
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
    padding: '24px 32px 0',
    display: 'flex',
    alignItems: 'baseline',
    gap: 16,
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
    padding: '32px',
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
