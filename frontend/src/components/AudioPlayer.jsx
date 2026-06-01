import { useState, useEffect, useRef } from 'react';

const BAR_COUNT = 60;

function makeRandomBars() {
  return Array.from({ length: BAR_COUNT }, () => ({ h: 15 + Math.random() * 75 }));
}

export default function AudioPlayer({ audioRef, audioUrl }) {
  const [playing, setPlaying]       = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const [volume, setVolume]         = useState(1);
  const [bars, setBars]             = useState(makeRandomBars);
  const animRef                     = useRef(null);

  // Wire up audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay    = () => setPlaying(true);
    const onPause   = () => setPlaying(false);
    const onTime    = () => setCurrentTime(audio.currentTime);
    const onDur     = () => setDuration(audio.duration);
    const onEnd     = () => setPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDur);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDur);
      audio.removeEventListener('ended', onEnd);
    };
  }, [audioRef]);

  // Reset on track change
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
  }, [audioUrl]);

  // Animate waveform bars while playing
  useEffect(() => {
    if (playing) {
      animRef.current = setInterval(() => setBars(makeRandomBars()), 120);
    } else {
      clearInterval(animRef.current);
    }
    return () => clearInterval(animRef.current);
  }, [playing]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    playing ? audio.pause() : audio.play().catch(console.error);
  }

  function restart() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(console.error);
  }

  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }

  function handleVolume(e) {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }

  const progress = duration > 0 ? currentTime / duration : 0;
  const played   = Math.round(progress * BAR_COUNT);

  return (
    <div style={P.wrap}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      {/* Waveform */}
      <div style={P.waveform} onClick={handleSeek} title="Seek">
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              ...P.bar,
              height: `${b.h}%`,
              background: i < played ? 'var(--tertiary)' : 'rgba(255,255,255,0.15)',
              boxShadow: i < played ? '0 0 6px rgba(76,215,246,0.5)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Time */}
      <div style={P.timeRow}>
        <span style={P.time}>{fmt(currentTime)}</span>
        <span style={P.time}>{duration ? fmt(duration) : '--:--'}</span>
      </div>

      {/* Controls */}
      <div style={P.controls}>
        <button style={P.iconBtn} onClick={restart} title="Restart">
          <span className="material-symbols-outlined" style={{ fontSize: 26 }}>skip_previous</span>
        </button>

        <button
          style={P.playBtn}
          onClick={togglePlay}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 30, fontVariationSettings: "'FILL' 1" }}>
            {playing ? 'pause' : 'play_arrow'}
          </span>
        </button>

        <div style={P.volRow}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--text-muted)' }}>
            {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
          </span>
          <input
            type="range" min="0" max="1" step="0.05"
            value={volume} onChange={handleVolume}
            style={{ width: 72, cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}

function fmt(secs) {
  if (!isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const P = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' },
  waveform: {
    display: 'flex', alignItems: 'center', gap: '2px',
    height: 64, cursor: 'pointer',
    padding: '4px 0',
  },
  bar: {
    flex: 1, borderRadius: '2px 2px 1px 1px',
    minHeight: 3,
    transition: 'height 0.1s ease',
  },
  timeRow: {
    display: 'flex', justifyContent: 'space-between', marginTop: 2,
  },
  time: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, color: 'var(--text-muted)',
  },
  controls: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 20, marginTop: 8,
  },
  iconBtn: {
    background: 'transparent', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: 4,
    borderRadius: 8, transition: 'color 0.15s',
  },
  playBtn: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none', color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 20px rgba(99,102,241,0.45)',
    transition: 'transform 0.15s',
  },
  volRow: {
    display: 'flex', alignItems: 'center', gap: 6,
  },
};
