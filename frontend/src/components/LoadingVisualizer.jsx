import { useEffect, useRef } from 'react';

export default function LoadingVisualizer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const SIZE = 420;
    canvas.width  = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    // Drifting star particles
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * SIZE,
      y: Math.random() * SIZE,
      r: Math.random() * 1.3 + 0.2,
      o: Math.random() * 0.7 + 0.1,
      speed: 0.08 + Math.random() * 0.18,
      twinkle: (Math.random() - 0.5) * 0.04,
    }));

    // Orbital particles on two rings
    const orbitals = [
      ...Array.from({ length: 10 }, (_, i) => ({
        angle: (i / 10) * Math.PI * 2,
        radius: 105,
        speed: 0.004,
        size: 1.8,
        color: 'rgba(195,192,255,',
      })),
      ...Array.from({ length: 7 }, (_, i) => ({
        angle: (i / 7) * Math.PI * 2,
        radius: 148,
        speed: -0.0025,
        size: 1.4,
        color: 'rgba(76,215,246,',
      })),
    ];

    let raf;
    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      t += 0.016;

      // ── Drifting stars ──────────────────────────────
      for (const s of stars) {
        s.y -= s.speed;
        s.o += s.twinkle;
        if (s.o < 0.05) s.twinkle = Math.abs(s.twinkle);
        if (s.o > 0.8)  s.twinkle = -Math.abs(s.twinkle);
        if (s.y < 0) { s.y = SIZE; s.x = Math.random() * SIZE; }
        ctx.globalAlpha = s.o;
        ctx.fillStyle   = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Nebula glow layers ──────────────────────────
      ctx.globalAlpha = 0.12 + 0.04 * Math.sin(t * 0.6);
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
      g1.addColorStop(0, 'rgba(99,102,241,1)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI * 2); ctx.fill();

      ctx.globalAlpha = 0.08 + 0.03 * Math.sin(t * 0.4 + 1.2);
      const g2 = ctx.createRadialGradient(cx - 20, cy - 20, 0, cx, cy, 140);
      g2.addColorStop(0, 'rgba(139,92,246,1)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.fill();

      // ── Core orb ───────────────────────────────────
      ctx.globalAlpha = 0.55 + 0.2 * Math.sin(t * 0.9);
      const gc = ctx.createRadialGradient(cx, cy, 0, cx, cy, 64);
      gc.addColorStop(0, 'rgba(195,192,255,1)');
      gc.addColorStop(0.45, 'rgba(99,102,241,0.7)');
      gc.addColorStop(1, 'transparent');
      ctx.fillStyle = gc;
      ctx.beginPath(); ctx.arc(cx, cy, 64, 0, Math.PI * 2); ctx.fill();

      // ── Spinning rings ─────────────────────────────
      const drawRing = (r, width, alpha, dash) => {
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = 'rgba(195,192,255,1)';
        ctx.lineWidth   = width;
        if (dash) ctx.setLineDash(dash);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      };
      drawRing(105, 0.6, 0.25);
      drawRing(148, 0.4, 0.14, [4, 12]);

      // Spinning arc overlays
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = 'rgba(195,192,255,1)';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 105, t * 0.6, t * 0.6 + 1.8);
      ctx.stroke();

      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = 'rgba(76,215,246,1)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 148, -t * 0.4, -t * 0.4 + 2.5);
      ctx.stroke();

      // ── Orbital particles ──────────────────────────
      for (const o of orbitals) {
        o.angle += o.speed;
        const px = cx + Math.cos(o.angle) * o.radius;
        const py = cy + Math.sin(o.angle) * o.radius;
        ctx.globalAlpha = 0.6 + 0.3 * Math.sin(o.angle * 3 + t);
        ctx.fillStyle   = o.color + '1)';
        ctx.beginPath(); ctx.arc(px, py, o.size, 0, Math.PI * 2); ctx.fill();
        // tiny trail
        ctx.globalAlpha = 0.15;
        ctx.beginPath(); ctx.arc(px, py, o.size * 3, 0, Math.PI * 2); ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={V.wrap}>
      <div style={V.canvasWrap}>
        <canvas ref={canvasRef} style={V.canvas} />
      </div>
      <div style={V.textWrap}>
        <p style={V.label}>Generating beat</p>
        <div style={V.dots}>
          {[0, 0.3, 0.6].map((d, i) => (
            <span
              key={i}
              style={{
                width: 4, height: 4, borderRadius: '50%',
                background: 'var(--accent)',
                display: 'inline-block',
                animation: `eq-bounce 1.2s ease-in-out infinite`,
                animationDelay: `${d}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const V = {
  wrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
  },
  canvasWrap: {
    position: 'relative',
    width: 280, height: 280,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  canvas: {
    width: 280, height: 280,
    borderRadius: '50%',
  },
  textWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12, color: 'var(--text-muted)',
    letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
    filter: 'drop-shadow(0 0 8px rgba(195,192,255,0.4))',
  },
  dots: {
    display: 'flex', gap: 6, alignItems: 'center',
  },
};
