const MOODS = ['dark', 'uplifting', 'aggressive', 'chill', 'cinematic'];
const ENERGY_LEVELS = ['low', 'medium', 'high'];

export default function BeatControls({ controls, onChange, onRegenerate, loading, hasBeat }) {
  const { bpm, energy, moods } = controls;

  function toggleMood(mood) {
    const next = moods.includes(mood)
      ? moods.filter((m) => m !== mood)
      : [...moods, mood];
    onChange({ ...controls, moods: next });
  }

  return (
    <div style={styles.panel}>
      <div style={styles.row}>
        {/* BPM slider */}
        <div style={styles.controlGroup}>
          <div style={styles.labelRow}>
            <span style={styles.label}>BPM</span>
            <span style={styles.value}>{bpm}</span>
          </div>
          <input
            type="range"
            min={60}
            max={200}
            value={bpm}
            onChange={(e) => onChange({ ...controls, bpm: Number(e.target.value) })}
            style={styles.slider}
          />
          <div style={styles.rangeEnds}>
            <span>60</span>
            <span>200</span>
          </div>
        </div>

        {/* Energy */}
        <div style={styles.controlGroup}>
          <span style={styles.label}>Energy</span>
          <div style={styles.btnGroup}>
            {ENERGY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => onChange({ ...controls, energy: level })}
                style={{
                  ...styles.toggleBtn,
                  ...(energy === level ? styles.toggleBtnOn : {}),
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Moods */}
        <div style={styles.controlGroup}>
          <span style={styles.label}>Mood</span>
          <div style={styles.btnGroup}>
            {MOODS.map((mood) => (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                style={{
                  ...styles.toggleBtn,
                  ...(moods.includes(mood) ? styles.toggleBtnOn : {}),
                }}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Regenerate */}
        {hasBeat && (
          <button
            onClick={onRegenerate}
            disabled={loading}
            style={{ ...styles.regenBtn, opacity: loading ? 0.45 : 1 }}
          >
            ↺ Regenerate
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  panel: {
    borderTop: '1px solid var(--border)',
    padding: '12px 32px 14px',
    background: 'var(--bg-surface)',
    flexShrink: 0,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 120,
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  value: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--accent)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  slider: {
    width: '100%',
    accentColor: 'var(--accent)',
    cursor: 'pointer',
    height: 4,
  },
  rangeEnds: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 10,
    color: 'var(--text-muted)',
  },
  btnGroup: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  },
  toggleBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 4,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.12s',
  },
  toggleBtnOn: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
  },
  regenBtn: {
    marginLeft: 'auto',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    fontFamily: "'Inter', sans-serif",
    transition: 'opacity 0.15s',
    whiteSpace: 'nowrap',
  },
};
