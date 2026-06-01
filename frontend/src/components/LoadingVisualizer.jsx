const BAR_COUNT = 20;
const HEIGHTS = [38, 58, 46, 72, 42, 80, 54, 66, 44, 76, 50, 62, 70, 40, 68, 56, 78, 48, 60, 52];
const DURATIONS = [0.7, 0.95, 0.6, 1.05, 0.75, 0.85, 0.65, 0.9, 0.8, 0.7, 1.0, 0.6, 0.85, 0.75, 0.65, 0.95, 0.7, 0.8, 0.9, 0.6];

export default function LoadingVisualizer() {
  return (
    <div style={styles.container}>
      <div style={styles.visualizer}>
        {Array.from({ length: BAR_COUNT }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.bar,
              height: HEIGHTS[i],
              animationDuration: `${DURATIONS[i]}s`,
              animationDelay: `${(i * 0.06).toFixed(2)}s`,
            }}
          />
        ))}
      </div>
      <p style={styles.label}>Generating beat…</p>
      <style>{`
        @keyframes eq {
          0%, 100% { transform: scaleY(0.08); opacity: 0.25; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 28,
  },
  visualizer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 5,
    height: 90,
  },
  bar: {
    width: 7,
    background: 'linear-gradient(to top, var(--accent), #b8a8ff)',
    borderRadius: '3px 3px 2px 2px',
    transformOrigin: 'bottom',
    animation: 'eq 0.8s ease-in-out infinite',
    boxShadow: '0 0 6px var(--accent-glow)',
  },
  label: {
    color: 'var(--text-muted)',
    fontSize: 13,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
};
