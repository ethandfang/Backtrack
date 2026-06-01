import { downloadMp3 } from './BeatCard.jsx';

export default function BeatTabs({ beats, activeBeatIndex, onSelect }) {
  return (
    <div style={T.bar}>
      <div style={T.tabGroup}>
        {beats.length === 0 ? (
          <div style={T.emptyLabel}>No beats yet — start in the chat</div>
        ) : (
          beats.map((beat, i) => {
            const active = i === activeBeatIndex;
            return (
              <button
                key={beat.id}
                onClick={() => onSelect(i)}
                style={{ ...T.tab, ...(active ? T.tabActive : {}) }}
              >
                <span>{beat.label}</span>
                {active && (
                  <span
                    className="material-symbols-outlined"
                    style={T.dlIcon}
                    title="Download MP3"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadMp3(beat.audioUrl, `${beat.label.replace(' ', '-')}.mp3`);
                    }}
                  >
                    download
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

const T = {
  bar: {
    padding: '16px 24px 0',
    flexShrink: 0,
  },
  tabGroup: {
    display: 'inline-flex',
    background: 'rgba(31,31,37,0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 9999,
    padding: '4px',
    gap: 2,
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 18px',
    borderRadius: 9999,
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13, fontWeight: 500,
    letterSpacing: '0.04em',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    background: 'rgba(195,192,255,0.12)',
    color: 'var(--accent)',
    boxShadow: '0 0 12px rgba(195,192,255,0.15)',
  },
  dlIcon: {
    fontSize: 14,
    opacity: 0.65,
    cursor: 'pointer',
    lineHeight: 1,
  },
  emptyLabel: {
    padding: '6px 18px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: 'var(--text-muted)',
    letterSpacing: '0.04em',
  },
};
