import { useState, useEffect } from 'react';

export default function AudioPlayer({ audioRef, audioUrl }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioRef]);

  // Reset state when track changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setPlaying(false);
  }, [audioUrl]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  }

  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audio.currentTime = pct * duration;
  }

  function handleVolume(e) {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }

  function restart() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(console.error);
  }

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div style={styles.player}>
      {/* Hidden native audio element */}
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      {/* Progress bar */}
      <div style={styles.progressWrap} onClick={handleSeek} title="Seek">
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progress * 100}%` }} />
          <div style={{ ...styles.progressThumb, left: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Time */}
      <div style={styles.timeRow}>
        <span style={styles.timeLabel}>{fmt(currentTime)}</span>
        <span style={styles.timeLabel}>{duration ? fmt(duration) : '--:--'}</span>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button style={styles.controlBtn} onClick={restart} title="Restart">⏮</button>
        <button style={styles.playBtn} onClick={togglePlay}>
          {playing ? '⏸' : '▶'}
        </button>
        <div style={styles.volumeWrap}>
          <span style={styles.volIcon}>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolume}
            style={styles.volSlider}
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

const styles = {
  player: {
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-surface)',
    padding: '16px 32px 20px',
  },
  progressWrap: {
    cursor: 'pointer',
    padding: '8px 0',
  },
  progressTrack: {
    height: 4,
    background: 'var(--border)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    background: 'var(--accent)',
    borderRadius: 2,
    transition: 'width 0.1s linear',
  },
  progressThumb: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 8px var(--accent-glow)',
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  controlBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: 18,
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 6,
    lineHeight: 1,
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'var(--accent)',
    border: 'none',
    color: '#fff',
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px var(--accent-glow)',
    transition: 'transform 0.1s',
  },
  volumeWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  volIcon: {
    fontSize: 16,
  },
  volSlider: {
    width: 80,
    accentColor: 'var(--accent)',
    cursor: 'pointer',
  },
};
