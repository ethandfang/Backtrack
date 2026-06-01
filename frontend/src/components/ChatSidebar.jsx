import { useState, useRef, useEffect } from 'react';

export default function ChatSidebar({ messages, loading, onSend, onSelectBeat }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const val = input.trim();
    if (!val) return;
    setInput('');
    onSend(val);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <span style={styles.sidebarTitle}>Chat</span>
        <span style={styles.msgCount}>{messages.length} messages</span>
      </div>

      <div style={styles.messageList}>
        {messages.length === 0 && (
          <div style={styles.welcomeMsg}>
            <p style={styles.welcomeText}>
              Describe a beat, vibe, genre, or BPM — or just tell me how you want it to feel.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} msg={msg} onSelectBeat={onSelectBeat} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputArea}>
        <textarea
          ref={textareaRef}
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={messages.length === 0
            ? 'e.g. "dark trap, 140 BPM, heavy 808s, minor key"'
            : 'Edit command, e.g. "make it brighter" or "add guitar"'}
          rows={3}
          disabled={loading}
        />
        <button
          style={{ ...styles.sendBtn, opacity: loading || !input.trim() ? 0.4 : 1 }}
          onClick={submit}
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : 'Generate'}
        </button>
      </div>
    </aside>
  );
}

function Message({ msg, onSelectBeat }) {
  if (msg.role === 'user') {
    return (
      <div style={styles.userBubble}>
        <p style={styles.userText}>{msg.content}</p>
      </div>
    );
  }

  if (msg.role === 'error') {
    return (
      <div style={styles.errorBubble}>
        <span style={styles.errorIcon}>⚠</span>
        <p style={styles.errorText}>{msg.content}</p>
      </div>
    );
  }

  // assistant message with beat
  return (
    <div style={styles.assistantBubble}>
      <div style={styles.promptLabel}>Generated prompt</div>
      <p style={styles.promptText}>{msg.content}</p>
      {msg.beat && (
        <button
          style={styles.playBeatBtn}
          onClick={() => onSelectBeat(msg.beat)}
        >
          ▶ Load this beat
        </button>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={styles.typingRow}>
      <div style={styles.typingDots}>
        <span style={{ ...styles.dot, animationDelay: '0ms' }} />
        <span style={{ ...styles.dot, animationDelay: '150ms' }} />
        <span style={{ ...styles.dot, animationDelay: '300ms' }} />
      </div>
      <span style={styles.typingLabel}>Generating beat…</span>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 340,
    minWidth: 340,
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  sidebarHeader: {
    padding: '20px 20px 16px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  msgCount: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 16px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  welcomeMsg: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '14px 16px',
  },
  welcomeText: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  userBubble: {
    alignSelf: 'flex-end',
    background: 'var(--accent)',
    borderRadius: '12px 12px 2px 12px',
    padding: '10px 14px',
    maxWidth: '85%',
  },
  userText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 1.5,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '2px 12px 12px 12px',
    padding: '12px 14px',
    maxWidth: '95%',
  },
  promptLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  promptText: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    fontFamily: "'JetBrains Mono', monospace",
  },
  playBeatBtn: {
    marginTop: 10,
    background: 'transparent',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    fontSize: 12,
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    letterSpacing: '0.03em',
  },
  errorBubble: {
    alignSelf: 'flex-start',
    background: 'rgba(248, 113, 113, 0.08)',
    border: '1px solid rgba(248, 113, 113, 0.3)',
    borderRadius: 10,
    padding: '10px 14px',
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start',
    maxWidth: '95%',
  },
  errorIcon: {
    fontSize: 14,
    color: 'var(--error)',
    marginTop: 1,
  },
  errorText: {
    fontSize: 13,
    color: 'var(--error)',
    lineHeight: 1.5,
  },
  typingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '4px 0',
  },
  typingDots: {
    display: 'flex',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    display: 'inline-block',
    animation: 'bounce 1.2s infinite',
  },
  typingLabel: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  inputArea: {
    padding: '12px 16px 16px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  textarea: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: 14,
    padding: '10px 12px',
    resize: 'none',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  sendBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'opacity 0.15s',
  },
};
