export default function BeatTabs({ beats, activeBeatIndex, onSelect }) {
  if (beats.length === 0) return null;

  return (
    <div style={styles.tabRow}>
      {beats.map((beat, i) => (
        <button
          key={beat.id}
          onClick={() => onSelect(i)}
          style={{
            ...styles.tab,
            ...(i === activeBeatIndex ? styles.tabActive : {}),
          }}
        >
          {beat.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  tabRow: {
    display: 'flex',
    gap: 6,
    padding: '12px 32px 0',
    overflowX: 'auto',
    flexShrink: 0,
  },
  tab: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: 12,
    fontWeight: 600,
    padding: '5px 14px',
    borderRadius: 20,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    letterSpacing: '0.03em',
    transition: 'all 0.15s',
    fontFamily: "'Inter', sans-serif",
  },
  tabActive: {
    background: 'var(--accent-glow)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
  },
};
