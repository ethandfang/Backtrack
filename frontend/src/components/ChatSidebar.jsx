import { useState, useRef, useEffect } from 'react';

export default function ChatSidebar({ messages, loading, onSend, onSelectBeat, onNewBeat }) {
  const [input, setInput] = useState('');
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  function submit() {
    const val = input.trim();
    if (!val) return;
    setInput('');
    onSend(val);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleNewBeat() {
    onNewBeat?.();
    inputRef.current?.focus();
  }

  return (
    <aside style={S.sidebar}>
      {/* Header */}
      <div style={S.header}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--accent)' }}>auto_awesome</span>
        <span style={S.title}>Studio Chat</span>
      </div>

      {/* Messages */}
      <div style={S.messages}>
        {messages.length === 0 && (
          <div style={S.welcome}>
            <p style={S.welcomeText}>
              Describe a beat, vibe, genre, or BPM — tell me how you want it to feel.
            </p>
          </div>
        )}
        {messages.map((msg, i) => <Message key={i} msg={msg} onSelectBeat={onSelectBeat} />)}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={S.inputArea}>
        <div style={S.inputWrap}>
          <input
            ref={inputRef}
            style={S.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={messages.length === 0 ? 'Prompt your next evolution…' : 'Edit: "make it brighter"…'}
            disabled={loading}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(195,192,255,0.4)'; }}
            onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
          <button
            style={{ ...S.sendBtn, opacity: loading || !input.trim() ? 0.35 : 1 }}
            onClick={submit}
            disabled={loading || !input.trim()}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
          </button>
        </div>
      </div>

      {/* Generate New Beat */}
      <div style={S.genWrap}>
        <button
          style={S.genBtn}
          onClick={handleNewBeat}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(79,70,229,0.55)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 18px rgba(79,70,229,0.35)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Generate New Beat
        </button>
      </div>
    </aside>
  );
}

function Message({ msg, onSelectBeat }) {
  if (msg.role === 'user') {
    return (
      <div style={M.userRow}>
        <div style={M.userBubble}>
          <p style={M.userText}>{msg.content}</p>
        </div>
      </div>
    );
  }
  if (msg.role === 'error') {
    return (
      <div style={M.errorBubble}>
        <span style={{ fontSize: 14, color: 'var(--error)' }}>⚠</span>
        <p style={M.errorText}>{msg.content}</p>
      </div>
    );
  }
  return (
    <div style={M.aiBubble}>
      <div style={M.aiLabel}>Generated Prompt</div>
      <p style={M.aiText}>{msg.content}</p>
      {msg.beat && (
        <button style={M.loadBtn} onClick={() => onSelectBeat(msg.beat)}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>play_arrow</span>
          Load this beat
        </button>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0', animation: 'fadeInUp 0.2s ease' }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
              display: 'inline-block',
              animation: 'eq-bounce 1.2s ease-in-out infinite',
              animationDelay: `${d}ms`,
            }}
          />
        ))}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>
        Generating beat…
      </span>
    </div>
  );
}

const S = {
  sidebar: {
    width: 300, minWidth: 300,
    backdropFilter: 'blur(40px)',
    background: 'rgba(19,19,25,0.65)',
    borderRight: '1px solid rgba(195,192,255,0.15)',
    boxShadow: '0 0 15px rgba(195,192,255,0.08)',
    display: 'flex', flexDirection: 'column',
    height: '100%',
    position: 'relative', zIndex: 1,
  },
  header: {
    padding: '20px 20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', gap: 8,
    flexShrink: 0,
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 16, fontWeight: 600, color: 'var(--accent)',
    letterSpacing: '0.04em',
  },
  messages: {
    flex: 1, overflowY: 'auto',
    padding: '16px 14px 8px',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  welcome: {
    backdropFilter: 'blur(20px)',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: '14px 16px',
  },
  welcomeText: {
    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65,
    fontFamily: "'Inter', sans-serif",
  },
  inputArea: {
    padding: '10px 14px 0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 9999,
    color: 'var(--text-primary)',
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    padding: '10px 44px 10px 18px',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  sendBtn: {
    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
    background: 'transparent', border: 'none',
    color: 'var(--accent)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: 4,
    transition: 'opacity 0.15s',
  },
  genWrap: {
    padding: '12px 14px 16px',
    flexShrink: 0,
  },
  genBtn: {
    width: '100%', padding: '13px',
    borderRadius: 9999,
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    border: 'none',
    color: '#fff',
    fontFamily: "'Sora', sans-serif",
    fontSize: 14, fontWeight: 600, letterSpacing: '0.04em',
    cursor: 'pointer',
    boxShadow: '0 0 18px rgba(79,70,229,0.35)',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
};

const M = {
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  userBubble: {
    background: 'rgba(99,102,241,0.25)',
    border: '1px solid rgba(99,102,241,0.35)',
    borderRadius: '14px 14px 2px 14px',
    padding: '10px 14px', maxWidth: '88%',
  },
  userText: { fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 },
  aiBubble: {
    backdropFilter: 'blur(20px)',
    background: 'rgba(87,27,193,0.12)',
    border: '1px solid rgba(160,32,240,0.25)',
    boxShadow: '0 0 12px rgba(160,32,240,0.08)',
    borderRadius: '2px 14px 14px 14px',
    padding: '12px 14px', maxWidth: '95%',
    animation: 'fadeInUp 0.2s ease',
  },
  aiLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, color: 'var(--accent)',
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
  },
  aiText: {
    fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
    fontFamily: "'JetBrains Mono', monospace",
  },
  loadBtn: {
    marginTop: 10, background: 'transparent',
    border: '1px solid rgba(195,192,255,0.3)',
    color: 'var(--accent)',
    fontSize: 12, fontWeight: 600,
    padding: '5px 12px', borderRadius: 9999,
    cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.03em',
  },
  errorBubble: {
    background: 'rgba(248,113,113,0.07)',
    border: '1px solid rgba(248,113,113,0.2)',
    borderRadius: 10, padding: '10px 14px',
    display: 'flex', gap: 8, alignItems: 'flex-start', maxWidth: '95%',
  },
  errorText: { fontSize: 13, color: 'var(--error)', lineHeight: 1.5 },
};
