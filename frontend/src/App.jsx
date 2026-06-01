import { useState, useRef, useEffect } from 'react';
import ChatSidebar from './components/ChatSidebar.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import LoadingVisualizer from './components/LoadingVisualizer.jsx';
import BeatControls from './components/BeatControls.jsx';
import BeatTabs from './components/BeatTabs.jsx';
import { parseMeta } from './components/BeatCard.jsx';

/* ─────────────────────────────────────────
   Landing Page
───────────────────────────────────────── */
function LandingPage({ onEnter }) {
  const starsRef  = useRef(null);
  const galaxyRef = useRef(null);
  const [exiting, setExiting] = useState(false);

  // Starfield — full background
  useEffect(() => {
    const canvas = starsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2, o: Math.random(), d: 0.003 + Math.random() * 0.009,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.o += s.d;
        if (s.o > 1 || s.o < 0) s.d = -s.d;
        ctx.globalAlpha = Math.abs(s.o);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // Galaxy swirl — centred behind the title
  useEffect(() => {
    const canvas = galaxyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const S = 560;
    canvas.width = S; canvas.height = S;
    const cx = S / 2, cy = S / 2;

    const orbitals = [
      ...Array.from({ length: 14 }, (_, i) => ({ angle: (i / 14) * Math.PI * 2, radius: 140, speed:  0.003, size: 2.2, color: 'rgba(195,192,255,' })),
      ...Array.from({ length: 10 }, (_, i) => ({ angle: (i / 10) * Math.PI * 2, radius: 198, speed: -0.002, size: 1.6, color: 'rgba(76,215,246,'  })),
      ...Array.from({ length:  7 }, (_, i) => ({ angle: (i /  7) * Math.PI * 2, radius: 245, speed:  0.0015,size: 1.2, color: 'rgba(139,92,246,'  })),
    ];

    let raf, t = 0;
    function draw() {
      ctx.clearRect(0, 0, S, S);
      t += 0.012;

      // Nebula glow
      ctx.globalAlpha = 0.18 + 0.06 * Math.sin(t * 0.5);
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 240);
      g1.addColorStop(0, 'rgba(99,102,241,1)'); g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1; ctx.beginPath(); ctx.arc(cx, cy, 240, 0, Math.PI * 2); ctx.fill();

      ctx.globalAlpha = 0.12 + 0.04 * Math.sin(t * 0.3 + 1);
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
      g2.addColorStop(0, 'rgba(139,92,246,1)'); g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI * 2); ctx.fill();

      ctx.globalAlpha = 0.07 + 0.03 * Math.sin(t * 0.7 + 2);
      const g3 = ctx.createRadialGradient(cx + 30, cy - 20, 0, cx, cy, 160);
      g3.addColorStop(0, 'rgba(76,215,246,1)'); g3.addColorStop(1, 'transparent');
      ctx.fillStyle = g3; ctx.beginPath(); ctx.arc(cx, cy, 160, 0, Math.PI * 2); ctx.fill();

      // Core orb
      ctx.globalAlpha = 0.6 + 0.2 * Math.sin(t * 0.8);
      const gc = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      gc.addColorStop(0, 'rgba(255,255,255,1)');
      gc.addColorStop(0.2, 'rgba(195,192,255,1)');
      gc.addColorStop(0.6, 'rgba(99,102,241,0.6)');
      gc.addColorStop(1, 'transparent');
      ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.fill();

      // Static rings
      [
        { r: 140, a: 0.22, w: 0.7 },
        { r: 198, a: 0.14, w: 0.5 },
        { r: 245, a: 0.09, w: 0.4 },
      ].forEach(({ r, a, w }) => {
        ctx.globalAlpha = a;
        ctx.strokeStyle = 'rgba(195,192,255,1)';
        ctx.lineWidth = w;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      });

      // Spinning arcs
      const arcs = [
        { r: 140, speed:  0.7, len: 1.6, color: 'rgba(195,192,255,1)', w: 1.8, a: 0.55 },
        { r: 198, speed: -0.45, len: 2.2, color: 'rgba(76,215,246,1)',  w: 1.2, a: 0.4  },
        { r: 245, speed:  0.3, len: 1.2, color: 'rgba(139,92,246,1)',  w: 0.9, a: 0.3  },
      ];
      arcs.forEach(({ r, speed, len, color, w, a }) => {
        ctx.globalAlpha = a;
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(cx, cy, r, t * speed, t * speed + len); ctx.stroke();
      });

      // Orbital particles + trails
      for (const o of orbitals) {
        o.angle += o.speed;
        const px = cx + Math.cos(o.angle) * o.radius;
        const py = cy + Math.sin(o.angle) * o.radius;
        ctx.globalAlpha = 0.55 + 0.35 * Math.sin(o.angle * 4 + t);
        ctx.fillStyle = o.color + '1)';
        ctx.beginPath(); ctx.arc(px, py, o.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.12;
        ctx.beginPath(); ctx.arc(px, py, o.size * 4, 0, Math.PI * 2); ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleEnter() {
    setExiting(true);
    setTimeout(onEnter, 580);
  }

  return (
    <div style={{ ...LS.wrap, opacity: exiting ? 0 : 1, transform: exiting ? 'scale(1.04)' : 'scale(1)' }}>
      <canvas ref={starsRef} style={LS.starsCanvas} />
      {/* Galaxy swirl centred on screen */}
      <canvas ref={galaxyRef} style={LS.galaxyCanvas} />
      <div style={LS.content}>
        <h1 style={LS.title}>BACKTRACK</h1>
        <p style={LS.sub}>Describe your beat. We'll build it.</p>
        <button
          style={LS.btn}
          onClick={handleEnter}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.75), 0 0 100px rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.45)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
        >
          Enter Studio
        </button>
      </div>
    </div>
  );
}

const LS = {
  wrap: {
    position: 'fixed', inset: 0,
    background: '#020205',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'opacity 0.58s ease, transform 0.58s ease',
    zIndex: 100,
    overflow: 'hidden',
  },
  starsCanvas: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
  },
  galaxyCanvas: {
    position: 'absolute',
    width: 560, height: 560,
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: 0.9,
  },
  content: {
    position: 'relative', zIndex: 10,
    textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
    animation: 'fadeInUp 0.9s ease',
    marginTop: 320,
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 'clamp(52px, 9vw, 96px)',
    fontWeight: 700, letterSpacing: '0.2em',
    color: '#e4e1ea',
    textShadow: '0 0 50px rgba(195,192,255,0.3), 0 0 100px rgba(99,102,241,0.2)',
    lineHeight: 1,
  },
  sub: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 18, color: '#918fa1', letterSpacing: '0.05em',
  },
  btn: {
    marginTop: 12, padding: '15px 44px',
    borderRadius: 9999,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none', color: '#fff',
    fontFamily: "'Sora', sans-serif",
    fontSize: 16, fontWeight: 600, letterSpacing: '0.07em',
    cursor: 'pointer',
    boxShadow: '0 0 24px rgba(99,102,241,0.45)',
    transition: 'box-shadow 0.22s ease, transform 0.22s ease',
  },
};

/* ─────────────────────────────────────────
   Right Panel — Session Data
───────────────────────────────────────── */
function SessionPanel({ beat, previousPrompt, controls }) {
  const meta = parseMeta(beat?.musicPrompt ?? '');

  return (
    <aside style={RS.panel}>
      <div style={RS.scanlines} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflow: 'hidden' }}>

        {/* Session Data */}
        <div>
          <h3 style={RS.sectionTitle}>SESSION DATA</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['BPM',   meta.bpm ?? controls.bpm],
              ['KEY',   meta.key ?? '—'],
              ['BITS',  '32-FLOAT'],
              ['SRATE', '48 KHZ'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={RS.metaKey}>{k}</span>
                <span style={RS.metaVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Prompt */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <h3 style={RS.sectionTitle}>ACTIVE PROMPT</h3>
          <div style={RS.promptBox}>
            <span style={{ color: 'var(--tertiary)', opacity: 0.5 }}>&gt; </span>
            <span style={RS.promptText}>
              {previousPrompt ?? 'No prompt generated yet.'}
            </span>
          </div>
        </div>

        {/* Animated Orb */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, paddingBottom: 4 }}>
          <div style={RS.orbWrap}>
            <div style={RS.orbCore} />
            <div style={RS.orbRing1} />
            <div style={RS.orbRing2} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--error)', display: 'inline-block', animation: 'blink 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              System Live
            </span>
          </div>
          <div style={{ marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-muted)', opacity: 0.3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            ID: 88-XLR-992 / SYNTH-STABLE
          </div>
        </div>

      </div>
    </aside>
  );
}

const RS = {
  panel: {
    width: 248, minWidth: 248,
    backdropFilter: 'blur(40px)',
    background: 'rgba(19,19,25,0.45)',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    padding: '22px 18px',
    display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden',
    height: '100%',
  },
  scanlines: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
  },
  sectionTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, fontWeight: 500,
    color: 'var(--tertiary)',
    letterSpacing: '0.12em', textTransform: 'uppercase',
    borderBottom: '1px solid rgba(76,215,246,0.18)',
    paddingBottom: 8, marginBottom: 14,
  },
  metaKey: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12, color: 'var(--text-muted)',
  },
  metaVal: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12, color: 'var(--text-primary)', fontWeight: 500,
  },
  promptBox: {
    flex: 1,
    padding: '12px 13px',
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  promptText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, color: 'var(--text-secondary)',
    lineHeight: 1.65,
  },
  orbWrap: {
    position: 'relative', width: 88, height: 88,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  orbCore: {
    position: 'absolute', width: 44, height: 44, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.85) 0%, rgba(139,92,246,0.4) 60%, transparent 100%)',
    filter: 'blur(5px)',
    animation: 'orbPulse 3s ease-in-out infinite',
  },
  orbRing1: {
    position: 'absolute', width: 68, height: 68, borderRadius: '50%',
    border: '1px solid rgba(99,102,241,0.3)',
    animation: 'orb-spin 7s linear infinite',
  },
  orbRing2: {
    position: 'absolute', width: 88, height: 88, borderRadius: '50%',
    border: '1px solid rgba(139,92,246,0.15)',
    animation: 'orb-spin 12s linear infinite reverse',
  },
};

/* ─────────────────────────────────────────
   Empty State
───────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 360, padding: '0 20px', animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ fontSize: 52, marginBottom: 18, filter: 'drop-shadow(0 0 24px rgba(99,102,241,0.45))' }}>◎</div>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
        Describe your beat
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
        Type something like{' '}
        <em style={{ color: 'var(--accent)', fontStyle: 'normal' }}>"dark trap, 140 BPM, heavy 808s"</em>
        {' '}in the chat to generate your first beat.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Root App
───────────────────────────────────────── */
export default function App() {
  const [showStudio,     setShowStudio]     = useState(false);
  const [messages,       setMessages]       = useState([]);
  const [beats,          setBeats]          = useState([]);
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [previousPrompt, setPreviousPrompt] = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [controls,       setControls]       = useState({ bpm: 120, energy: 'medium', moods: [] });
  const audioRef    = useRef(null);
  const beatCountRef = useRef(0);

  const currentBeat = beats[activeBeatIndex] ?? null;

  // Auto-play when active beat's audio URL changes
  useEffect(() => {
    if (currentBeat?.audioUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentBeat?.audioUrl]);

  // ── API ──────────────────────────────────────────────
  async function callApi(userMessage) {
    // Step 1: Claude translate + submit Suno job (fast, ~5s)
    const submitRes = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, previousPrompt }),
    });
    const submitData = await submitRes.json();
    if (!submitRes.ok) throw new Error(submitData.error ?? 'Submit failed');

    const { taskId, musicPrompt } = submitData;

    // Step 2: Poll from frontend — each call is a fast single-status-check
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 72; i++) {
      await delay(5000);
      const pollRes = await fetch(`/api/poll?taskId=${encodeURIComponent(taskId)}`);
      const pollData = await pollRes.json();
      if (!pollRes.ok) throw new Error(pollData.error ?? 'Poll failed');

      if (pollData.status === 'complete') {
        beatCountRef.current += 1;
        const beat = {
          id: Date.now(),
          label: `Beat ${beatCountRef.current}`,
          audioUrl: pollData.audioUrl,
          imageUrl: pollData.imageUrl,
          musicPrompt,
          controls: { ...controls },
        };
        setBeats((prev) => {
          const next = [...prev, beat];
          setActiveBeatIndex(next.length - 1);
          return next;
        });
        setPreviousPrompt(musicPrompt);
        return beat;
      }

      if (pollData.status === 'failed') throw new Error('Suno generation failed');
    }

    throw new Error('Generation timed out after 6 minutes');
  }

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

  function handleSelectBeat(beat) {
    const idx = beats.findIndex((b) => b.id === beat.id);
    if (idx !== -1) setActiveBeatIndex(idx);
  }

  function handleNewBeat() {
    setPreviousPrompt(null);
  }

  // ── Render ────────────────────────────────────────────
  if (!showStudio) {
    return <LandingPage onEnter={() => setShowStudio(true)} />;
  }

  return (
    <div style={A.layout}>
      {/* Ambient background nebula */}
      <div style={A.bgLayer} aria-hidden>
        <div style={A.bgOrb1} />
        <div style={A.bgOrb2} />
      </div>

      {/* Left: Chat */}
      <ChatSidebar
        messages={messages}
        loading={loading}
        onSend={handleSend}
        onSelectBeat={handleSelectBeat}
        onNewBeat={handleNewBeat}
      />

      {/* Center: Studio workspace */}
      <main style={A.main}>
        {/* Tab bar */}
        <BeatTabs beats={beats} activeBeatIndex={activeBeatIndex} onSelect={setActiveBeatIndex} />

        {/* Player area */}
        <div style={A.playerArea}>
          {loading ? (
            <LoadingVisualizer />
          ) : currentBeat ? (
            <div style={A.beatViewer}>
              {/* Square album art — preserved image generation feature */}
              <div style={A.albumWrap}>
                {currentBeat.imageUrl ? (
                  <img src={currentBeat.imageUrl} alt="Beat art" style={A.albumImg} />
                ) : (
                  <div style={A.albumPlaceholder}>
                    <span style={{ fontSize: 40, filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.5))' }}>◎</span>
                  </div>
                )}
              </div>
              {/* Player + metadata */}
              <div style={A.playerSide}>
                <div>
                  <h2 style={A.beatName}>{currentBeat.label}</h2>
                  <p style={A.beatSub}>Active Sequence</p>
                </div>
                <AudioPlayer audioRef={audioRef} audioUrl={currentBeat.audioUrl} />
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Controls */}
        <BeatControls
          controls={controls}
          onChange={setControls}
          onRegenerate={handleRegenerate}
          loading={loading}
          hasBeat={beats.length > 0}
        />
      </main>

      {/* Right: Session panel */}
      <SessionPanel beat={currentBeat} previousPrompt={previousPrompt} controls={controls} />
    </div>
  );
}

const A = {
  layout: {
    display: 'flex', height: '100vh', overflow: 'hidden',
    position: 'relative', background: '#020205',
  },
  bgLayer: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
  },
  bgOrb1: {
    position: 'absolute', width: 900, height: 900, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.055) 0%, transparent 70%)',
    top: '50%', left: '45%', transform: 'translate(-50%, -50%)',
    filter: 'blur(100px)',
  },
  bgOrb2: {
    position: 'absolute', width: 550, height: 550, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
    bottom: '-80px', right: '10%',
    filter: 'blur(70px)',
  },
  main: {
    flex: 1, display: 'flex', flexDirection: 'column',
    overflow: 'hidden', position: 'relative', zIndex: 1, minWidth: 0,
  },
  playerArea: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px 32px', overflow: 'hidden',
    backdropFilter: 'blur(2px)',
  },
  beatViewer: {
    display: 'flex', gap: 32, alignItems: 'center',
    width: '100%', maxWidth: 720,
    animation: 'fadeInUp 0.35s ease',
  },
  albumWrap: {
    width: 168, height: 168, borderRadius: 18, overflow: 'hidden',
    border: '1px solid rgba(195,192,255,0.18)',
    boxShadow: '0 0 35px rgba(99,102,241,0.25)',
    flexShrink: 0,
  },
  albumImg: { width: '100%', height: '100%', objectFit: 'cover' },
  albumPlaceholder: {
    width: '100%', height: '100%',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.12) 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  playerSide: {
    flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0,
  },
  beatName: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 20, fontWeight: 600, color: 'var(--text-primary)',
    letterSpacing: '0.05em',
    textShadow: '0 0 20px rgba(195,192,255,0.2)',
  },
  beatSub: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, color: 'var(--tertiary)', opacity: 0.8,
    textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 2,
  },
};
