import React, { useEffect, useRef } from "react";

const ComingSoon = () => {
  const canvasRef = useRef(null);

  /* subtle floating dust particles on canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const COLORS = ["#A77C5B", "#C4A882", "#6F4D34", "#E8D5C0"];
    const dots = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.35 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.globalAlpha = d.alpha;
        ctx.fill();
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap');

        .cs-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          background: #fdf4ef;
          font-family: 'Poppins', 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          position: relative;
          overflow: hidden;
        }

        /* canvas particles — behind everything */
        .cs-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Top bar ───────────────────────────────────────── */
        .cs-topbar {
          position: relative;
          z-index: 10;
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #f0ebe7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 24px;
        }
        .cs-topbar img {
          height: 36px;
          object-fit: contain;
        }

        /* ── Main layout ──────────────────────────────────── */
        .cs-main {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }

        .cs-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 820px;
          width: 100%;
          animation: csFadeUp 0.9s ease-out both;
        }

        @keyframes csFadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Badge */
        .cs-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1.5px solid #e9dfd8;
          border-radius: 999px;
          padding: 6px 18px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6F4D34;
          margin-bottom: 32px;
          box-shadow: 0 2px 10px rgba(111,77,52,0.08);
          animation: csFadeUp 0.9s ease-out 0.1s both;
        }
        .cs-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #A77C5B;
          animation: csPulse 1.8s ease-in-out infinite;
        }
        @keyframes csPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.3); }
        }

        /* Headline */
        .cs-headline {
          font-size: clamp(3rem, 9vw, 7.5rem);
          font-weight: 700;
          line-height: 1.0;
          letter-spacing: -2px;
          color: #2c1e17;
          margin: 0 0 8px;
          animation: csFadeUp 0.9s ease-out 0.2s both;
        }
        .cs-headline span {
          background: linear-gradient(135deg, #6F4D34 0%, #A77C5B 60%, #C4A882 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Site name */
        .cs-sitename {
          font-size: clamp(1.5rem, 4vw, 2.6rem);
          font-weight: 600;
          color: #6F4D34;
          letter-spacing: 0.02em;
          margin: 0 0 24px;
          animation: csFadeUp 0.9s ease-out 0.3s both;
        }

        /* Divider ornament */
        .cs-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          max-width: 420px;
          margin: 0 auto 28px;
          animation: csFadeUp 0.9s ease-out 0.35s both;
        }
        .cs-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #d4bfb0);
        }
        .cs-divider-line.right {
          background: linear-gradient(to left, transparent, #d4bfb0);
        }
        .cs-divider-diamond {
          width: 8px;
          height: 8px;
          border: 1.5px solid #A77C5B;
          transform: rotate(45deg);
          border-radius: 1px;
        }

        /* Lead text */
        .cs-lead {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: #7a6258;
          line-height: 1.75;
          max-width: 540px;
          margin: 0 auto 8px;
          animation: csFadeUp 0.9s ease-out 0.4s both;
        }
        .cs-tagline {
          font-style: italic;
          font-weight: 300;
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: #A77C5B;
          animation: csFadeUp 0.9s ease-out 0.5s both;
          margin-bottom: 0;
        }

        /* Decorative art-frame card */
        .cs-frame {
          margin-top: 40px;
          display: flex;
          gap: 20px;
          justify-content: center;
          animation: csFadeUp 0.9s ease-out 0.6s both;
          flex-wrap: wrap;
        }
        .cs-frame-pill {
          background: #ffffff;
          border: 1px solid #ede5e0;
          border-radius: 16px;
          padding: 14px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 14px rgba(111,77,52,0.07);
          min-width: 110px;
        }
        .cs-frame-pill-num {
          font-size: 1.5rem;
          font-weight: 700;
          color: #6F4D34;
          line-height: 1;
        }
        .cs-frame-pill-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #b09484;
        }

        /* ── Footer ──────────────────────────────────────── */
        .cs-footer {
          position: relative;
          z-index: 10;
          background: #ffffff;
          border-top: 1px solid #f0ebe7;
          padding: 18px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #9a7b6e;
          flex-wrap: wrap;
          gap: 10px;
        }
        .cs-footer strong {
          color: #6F4D34;
          font-weight: 700;
        }
        .cs-footer-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cs-footer-bc {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #b09484;
        }
        .cs-footer-sep {
          color: #ddd;
        }

        /* Warm tint blobs */
        .cs-glow {
          position: fixed;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(90px);
          z-index: 1;
        }
        .cs-glow-a {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(167,124,91,0.14), transparent 70%);
          top: -100px; right: -100px;
        }
        .cs-glow-b {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(196,168,130,0.12), transparent 70%);
          bottom: -80px; left: -80px;
        }

        @media (max-width: 600px) {
          .cs-headline { letter-spacing: -1px; }
          .cs-footer { padding: 16px 20px; flex-direction: column; text-align: center; }
          .cs-frame { gap: 12px; }
          .cs-frame-pill { min-width: 90px; padding: 12px 16px; }
        }
      `}</style>

      <div className="cs-root">
        {/* Canvas particles */}
        <canvas className="cs-canvas" ref={canvasRef} />

        {/* Warm ambient glows */}
        <div className="cs-glow cs-glow-a" />
        <div className="cs-glow cs-glow-b" />

        {/* Main content */}
        <main className="cs-main">
          <div className="cs-center">
            {/* Badge */}
            <div className="cs-badge">
              <span className="cs-badge-dot" />
              Something beautiful is coming
            </div>

            {/* Headline */}
            <h1 className="cs-headline">
              <span>Launching</span>
              <br />Soon
            </h1>

            {/* Site name */}
            <p className="cs-sitename windhavi">Artsays.in</p>

            {/* Ornament */}
            <div className="cs-divider">
              <div className="cs-divider-line" />
              <div className="cs-divider-diamond" />
              <div className="cs-divider-line right" />
            </div>

            {/* Sub copy */}
            <p className="cs-lead">A Brand Born From Art</p>
            <p className="cs-lead cs-tagline">When Art Speaks, Value Grows</p>

          </div>
        </main>

        {/* Footer */}
        <footer className="cs-footer">
          <div>© 2025 <strong>Artsays Private Limited</strong>. All rights reserved.</div>
          <div className="cs-footer-right">
            <span className="cs-footer-bc">Built By ByteCraft Studios</span>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ComingSoon;
