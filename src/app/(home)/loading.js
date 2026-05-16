"use client";

import { useEffect, useState } from "react";

/* ── Particle data (static — generated once) ──────────────────────────── */
const PARTICLES = [
  { w: 3, h: 3, top: "8%", left: "12%", delay: 0, dur: 3.2 },
  { w: 2, h: 2, top: "18%", left: "82%", delay: 0.4, dur: 2.8 },
  { w: 4, h: 4, top: "72%", left: "7%", delay: 0.8, dur: 3.6 },
  { w: 2, h: 2, top: "85%", left: "88%", delay: 1.2, dur: 2.4 },
  { w: 3, h: 3, top: "35%", left: "93%", delay: 0.6, dur: 3.0 },
  { w: 2, h: 2, top: "55%", left: "4%", delay: 1.6, dur: 3.8 },
  { w: 4, h: 4, top: "25%", left: "45%", delay: 2.0, dur: 2.6 },
  { w: 2, h: 2, top: "90%", left: "52%", delay: 0.2, dur: 3.4 },
  { w: 3, h: 3, top: "48%", left: "70%", delay: 1.4, dur: 2.9 },
  { w: 2, h: 2, top: "65%", left: "28%", delay: 1.8, dur: 3.1 },
];

/* ── Feature pills (what the app does) ────────────────────────────────── */
const FEATURES = [
  "বাল্ক ইনভয়েস প্রিন্ট",
  "অর্ডার ম্যানেজমেন্ট",
  "ফেক অর্ডার প্রতিরোধ",
  "স্টক ট্র্যাকিং",
  "কুরিয়ার ইন্টিগ্রেশন",
  "রিপোর্ট ও অ্যানালিটিক্স",
];

/* ── Hex ring component ────────────────────────────────────────────────── */
function HexRing({ size, color, delay, duration, opacity = 1 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: size,
        height: size,
        margin: "auto",
        border: `2px solid ${color}`,
        borderRadius: "50%",
        opacity,
        animation: `spin ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function HomeLoading() {
  const [progress, setProgress] = useState(0);
  const [featureIdx, setFeatureIdx] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const [mounted, setMounted] = useState(false);

  /* Entrance mount flag */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* Fake progress — 0→92 in 2.4 s */
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 92 ? 92 : p + Math.random() * 7 + 1));
    }, 180);
    return () => clearInterval(id);
  }, []);

  /* Cycle through feature labels */
  useEffect(() => {
    const id = setInterval(
      () => setFeatureIdx((i) => (i + 1) % FEATURES.length),
      1400
    );
    return () => clearInterval(id);
  }, []);

  /* Animated dots */
  useEffect(() => {
    const id = setInterval(() => setDotCount((d) => (d % 3) + 1), 500);
    return () => clearInterval(id);
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <div
      role="status"
      aria-label="পেজ লোড হচ্ছে"
      style={{
        position: "fixed",
        inset: 0,
        background: "#080514",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 9999,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
    >
      {/* ── Ambient background glows ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          animation: "pulse-slow 6s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "5%",
          right: "-5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
          animation: "pulse-slow 8s ease-in-out infinite reverse",
          filter: "blur(40px)",
          animationDelay: "2s",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: p.w,
            height: p.h,
            borderRadius: "50%",
            background: i % 3 === 0
              ? "rgba(167,139,250,0.6)"
              : i % 3 === 1
              ? "rgba(99,102,241,0.5)"
              : "rgba(196,181,253,0.4)",
            animation: `float ${p.dur}s ease-in-out infinite alternate`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* ── Central spinner ── */}
      <div
        style={{
          position: "relative",
          width: 120,
          height: 120,
          marginBottom: 40,
        }}
      >
        {/* Outermost slow ring */}
        <HexRing
          size={120}
          color="rgba(139,92,246,0.15)"
          delay={0}
          duration={8}
        />
        {/* Outer counter-spin ring */}
        <HexRing
          size={96}
          color="rgba(99,102,241,0.25)"
          delay={0}
          duration={5}
          opacity={0.7}
        />
        {/* Mid accent ring */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: 72,
            height: 72,
            margin: "auto",
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#7c3aed",
            borderRightColor: "rgba(99,102,241,0.4)",
            animation: "spin 1.1s linear infinite",
          }}
        />
        {/* Inner soft ring */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: 52,
            height: 52,
            margin: "auto",
            borderRadius: "50%",
            border: "1px solid rgba(196,181,253,0.2)",
            animation: "spin 2.2s linear infinite reverse",
          }}
        />

        {/* Logo disc */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 0 0 1px rgba(124,58,237,0.3), 0 8px 32px rgba(124,58,237,0.4)",
            animation: "breathe 2.5s ease-in-out infinite",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: 20,
              lineHeight: 1,
              fontFamily: "system-ui",
            }}
            aria-hidden="true"
          >
            আ
          </span>
        </div>

        {/* Orbiting dot */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: 96,
            height: 96,
            animation: "spin 2.4s linear infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#a78bfa",
              boxShadow: "0 0 8px rgba(167,139,250,0.8)",
            }}
          />
        </div>
      </div>

      {/* ── Brand name ── */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p
          style={{
            color: "#fff",
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: "-0.5px",
            margin: 0,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          AMAR
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dokan
          </span>
        </p>

        {/* Cycling feature label */}
        <div
          style={{
            marginTop: 8,
            height: 22,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            key={featureIdx}
            style={{
              color: "#8b5cf6",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              margin: 0,
              animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
              fontFamily: "'Hind Siliguri', sans-serif",
            }}
          >
            {FEATURES[featureIdx]}
          </p>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ width: 240, marginBottom: 16 }}>
        <div
          style={{
            width: "100%",
            height: 3,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7c3aed, #6366f1, #a78bfa)",
              borderRadius: 99,
              transition: "width 0.3s ease",
              boxShadow: "0 0 8px rgba(139,92,246,0.6)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <span
            style={{
              color: "rgba(148,163,184,0.7)",
              fontSize: 11,
              fontFamily: "system-ui",
            }}
          >
            লোড হচ্ছে{dots}
          </span>
          <span
            style={{
              color: "rgba(167,139,250,0.8)",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "system-ui",
            }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* ── Feature pills ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          maxWidth: 320,
          marginTop: 8,
        }}
        aria-hidden="true"
      >
        {FEATURES.map((f, i) => (
          <span
            key={f}
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: "1px solid rgba(139,92,246,0.2)",
              background: "rgba(139,92,246,0.06)",
              color: i === featureIdx
                ? "rgba(196,181,253,0.9)"
                : "rgba(148,163,184,0.4)",
              fontSize: 10.5,
              fontWeight: 600,
              transition: "all 0.35s ease",
              fontFamily: "'Hind Siliguri', system-ui, sans-serif",
              transform: i === featureIdx ? "scale(1.05)" : "scale(1)",
              boxShadow: i === featureIdx
                ? "0 0 10px rgba(139,92,246,0.2)"
                : "none",
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* ── Keyframe style block ── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes float {
          from { transform: translateY(0); }
          to   { transform: translateY(-10px); }
        }
        @keyframes breathe {
          0%, 100% { box-shadow: 0 0 0 1px rgba(124,58,237,0.3), 0 8px 32px rgba(124,58,237,0.4); }
          50%       { box-shadow: 0 0 0 3px rgba(124,58,237,0.2), 0 12px 40px rgba(124,58,237,0.6); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
