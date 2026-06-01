const MOODS = ['Dark', 'Uplifting', 'Aggressive', 'Chill', 'Cinematic'];
const ENERGY = ['low', 'medium', 'high'];

export default function BeatControls({ controls, onChange, onRegenerate, loading, hasBeat }) {
  const { bpm, energy, moods } = controls;

  function toggleMood(mood) {
    const lower = mood.toLowerCase();
    const next = moods.includes(lower)
      ? moods.filter((m) => m !== lower)
      : [...moods, lower];
    onChange({ ...controls, moods: next });
  }

  return (
    <div style={C.panel}>
      <div style={C.grid}>
        {/* BPM */}
        <div style={C.group}>
          <div style={C.labelRow}>
            <span style={C.label}>TEMPO (BPM)</span>
            <span style={C.bpmVal}>{bpm}</span>
          </div>
          <input
            type="range" min={60} max={200} value={bpm}
            onChange={(e) => onChange({ ...controls, bpm: Number(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={C.rangeEnds}><span>60</span><span>200</span></div>
        </div>

        {/* Energy */}
        <div style={C.group}>
          <span style={C.label}>ENERGY DENSITY</span>
          <div style={C.pills}>
            {ENERGY.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChange({ ...controls, energy: lvl })}
                style={{
                  ...C.pill,
                  ...(energy === lvl ? C.pillActive : {}),
                }}
              >
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Moods */}
      <div style={C.moodSection}>
        <span style={C.label}>SONIC MOOD</span>
        <div style={C.moodPills}>
          {MOODS.map((mood) => {
            const active = moods.includes(mood.toLowerCase());
            return (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                style={{ ...C.moodPill, ...(active ? C.moodPillActive : {}) }}
              >
                {mood}
              </button>
            );
          })}
        </div>
      </div>

      {/* Regenerate */}
      {hasBeat && (
        <button
          onClick={onRegenerate}
          disabled={loading}
          style={{ ...C.regenBtn, opacity: loading ? 0.45 : 1 }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, transition: 'transform 0.5s', transform: loading ? 'rotate(180deg)' : 'none' }}>
            refresh
          </span>
          Regenerate Core Sequence
        </button>
      )}
    </div>
  );
}

const C = {
  panel: {
    backdropFilter: 'blur(40px)',
    background: 'rgba(19,19,25,0.5)',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    padding: '16px 24px 18px',
    flexShrink: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px 32px',
    marginBottom: 14,
  },
  group: {
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  labelRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500,
  },
  bpmVal: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13, color: 'var(--accent)', fontWeight: 600,
  },
  rangeEnds: {
    display: 'flex', justifyContent: 'space-between',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, color: 'var(--text-muted)',
  },
  pills: {
    display: 'flex', gap: 6,
  },
  pill: {
    flex: 1, padding: '6px 4px',
    borderRadius: 9999,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, cursor: 'pointer',
    transition: 'all 0.15s',
  },
  pillActive: {
    border: '2px solid var(--accent)',
    background: 'rgba(195,192,255,0.1)',
    color: 'var(--accent)',
    boxShadow: '0 0 10px rgba(195,192,255,0.15)',
  },
  moodSection: {
    display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14,
  },
  moodPills: {
    display: 'flex', gap: 6, flexWrap: 'wrap',
  },
  moodPill: {
    padding: '5px 14px',
    borderRadius: 9999,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, cursor: 'pointer',
    transition: 'all 0.15s',
  },
  moodPillActive: {
    border: '1px solid rgba(195,192,255,0.4)',
    color: 'var(--accent)',
    background: 'rgba(195,192,255,0.08)',
  },
  regenBtn: {
    width: '100%', padding: '12px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text-primary)',
    fontFamily: "'Sora', sans-serif",
    fontSize: 14, fontWeight: 600, letterSpacing: '0.02em',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'background 0.15s, opacity 0.15s',
  },
};
