import React, { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Play, Volume2 } from "lucide-react";
import { useStore } from '../Store';

const FONT_HEAD = "'Quicksand', 'Segoe UI Rounded', 'Verdana', sans-serif";
const FONT_BODY = "'Inter', 'Segoe UI', sans-serif";

const COLORS = {
  bg: "#F3E8D6",          // warm eri-silk cream
  primary: "#5A3161",     // deep aubergine purple
  primaryDark: "#3D2817", // deep bark brown
  accent: "#8A5A2E",      // muga golden-brown
  accentDark: "#6B4423",
  text: "#3D2817",
  white: "#FFFFFF",
  padOff: "#332420",
  padOffLighter: "#453026",
};

const PADS = [
  { id: 0, lit: "#5A3161", icon: "🥁", freq: 261.63, name: "dhol" },
  { id: 1, lit: "#8A5A2E", icon: "🔔", freq: 329.63, name: "bell" },
  { id: 2, lit: "#7A4472", icon: "🪈", freq: 392.0, name: "flute" },
  { id: 3, lit: "#E8B98D", icon: "🎋", freq: 523.25, name: "chime" },
];

const ENCOURAGEMENTS = [
  "Lovely! You've got it.",
  "Wonderful memory!",
  "You matched it perfectly.",
  "Beautifully done.",
];

function randomPattern(steps) {
  const seq = [];
  for (let i = 0; i < steps; i++) {
    seq.push(Math.floor(Math.random() * 4));
  }
  return seq;
}



const CONFETTI_COLORS = ["#5A3161", "#8A5A2E", "#7A4472", "#E8B98D"];

function confettiPiece(i, side) {
  const spread = (Math.random() - 0.5) * 2;
  const dx = side === "left" ? 60 + Math.random() * 140 + spread * 20 : -(60 + Math.random() * 140) + spread * 20;
  const up = -(70 + Math.random() * 110);
  const down = 160 + Math.random() * 120;
  const rot = 180 + Math.random() * 540 * (Math.random() < 0.5 ? -1 : 1);
  const duration = 1.2 + Math.random() * 0.7;
  const delay = Math.random() * 0.18;
  const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
  const size = 6 + Math.random() * 6;
  const shape = i % 3;
  return { i, side, dx, up, down, rot, duration, delay, color, size, shape };
}

function Confetti({ burstKey }) {
  const pieces = [
    ...Array.from({ length: 16 }, (_, i) => confettiPiece(i, "left")),
    ...Array.from({ length: 16 }, (_, i) => confettiPiece(i + 16, "right")),
  ];
  return (
    <div key={burstKey} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 6 }}>
      {pieces.map((p) => (
        <div
          key={p.i}
          style={{
            position: "absolute",
            bottom: "8%",
            left: p.side === "left" ? "8%" : "auto",
            right: p.side === "right" ? "8%" : "auto",
            width: p.shape === 2 ? p.size * 0.5 : p.size,
            height: p.shape === 2 ? p.size * 1.8 : p.size,
            background: p.color,
            borderRadius: p.shape === 0 ? "50%" : 2,
            "--dx": `${p.dx}px`,
            "--up": `${p.up}px`,
            "--down": `${p.down}px`,
            "--rot": `${p.rot}deg`,
            animation: `confettiArc ${p.duration}s cubic-bezier(0.25,0.7,0.4,1) ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function PatternDrumGame() {
  const [phase, setPhase] = useState("idle");
  const [pattern, setPattern] = useState([]);
  const [activePad, setActivePad] = useState(null);
  const [userStep, setUserStep] = useState(0);
  const [message, setMessage] = useState("Tap Play to watch the pattern, then repeat it.");
  const [showOops, setShowOops] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  // Difficulty adaptation state
  const [wins, setWins] = useStore('consecutiveWins', 0);
  const [gameStats, setGameStats] = useStore('gameStats', { score: 70, mistakes: 0 });

  const currentLevel = Math.min(3 + Math.floor(wins / 3), 6);
  const showOnMs = Math.max(900 - (wins * 50), 300);
  const showGapMs = Math.max(450 - (wins * 20), 150);

  const roundStats = useRef({ mistakes: 0, tapTimestamps: [] });
  const audioCtxRef = useRef(null);

  const playTone = useCallback((freq) => {
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  }, []);

  function startRound() {
    const seq = randomPattern(currentLevel);
    setPattern(seq);
    setUserStep(0);
    roundStats.current = { mistakes: 0, tapTimestamps: [] };
    setMessage("Watch closely...");
    setPhase("showing");
    playSequence(seq);
  }

  function playSequence(seq) {
    seq.forEach((padIdx, i) => {
      setTimeout(() => {
        setActivePad(padIdx);
        playTone(PADS[padIdx].freq);
        setTimeout(() => setActivePad(null), showOnMs - 200);
      }, i * (showOnMs + showGapMs));
    });
    setTimeout(() => {
      setPhase("input");
      setMessage("Now it's your turn — tap the same order.");
    }, seq.length * (showOnMs + showGapMs));
  }

  function handlePadTap(padIdx) {
    if (phase !== "input") return;
    playTone(PADS[padIdx].freq);
    setActivePad(padIdx);
    setTimeout(() => setActivePad(null), 250);
    roundStats.current.tapTimestamps.push(Date.now());

    const expected = pattern[userStep];
    if (padIdx === expected) {
      const next = userStep + 1;
      if (next === pattern.length) {
        setMessage(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
        setPhase("success");
        setConfettiKey((k) => k + 1);
        setWins((prev) => prev + 1);
        setGameStats(prev => ({ ...prev, score: Math.min(100, prev.score + 1) }));
      } else {
        setUserStep(next);
      }
    } else {
      roundStats.current.mistakes += 1;
      setWins((prev) => Math.max(0, prev - 1)); // Decrement wins on mistake to adapt difficulty downwards
      setGameStats(prev => ({ ...prev, mistakes: prev.mistakes + 1, score: Math.max(0, prev.score - 1) }));
      setMessage("Let's watch it once more.");
      setPhase("retry");
      setShowOops(true);
      setTimeout(() => setShowOops(false), 1600);
      setTimeout(() => {
        setUserStep(0);
        setMessage("Watch closely...");
        setPhase("showing");
        playSequence(pattern);
      }, 1900);
    }
  }

  return (
    <div style={{ minHeight: 640, background: COLORS.bg, fontFamily: FONT_BODY, color: COLORS.text, maxWidth: 460, margin: "0 auto", borderRadius: 32, overflow: "hidden", boxShadow: "0 10px 30px rgba(61,40,23,0.15)", display: "flex", flexDirection: "column" }}>
      <div style={{ background: COLORS.primary, padding: "20px 20px 24px", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: "50%", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </button>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 21, fontWeight: 700, color: "#FFFFFF" }}>Play the Pattern</div>
        <div style={{ background: "#FFFFFF", borderRadius: "50%", padding: 4, display: "flex", width: 44, height: 44, overflow: "hidden" }}>
          <img src="/mascot.png" alt="Mascot" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      </div>
      <div style={{ padding: "34px 32px 8px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <style>{`
          @keyframes oopsPop {
            0% { opacity: 0; transform: scale(0.85); }
            15% { opacity: 1; transform: scale(1); }
            80% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.96); }
          }
          @keyframes confettiArc {
            0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(0.6); }
            8% { opacity: 1; transform: translate(calc(var(--dx) * 0.3), calc(var(--up) * 0.6)) rotate(calc(var(--rot) * 0.3)) scale(1); }
            45% { opacity: 1; transform: translate(var(--dx), var(--up)) rotate(calc(var(--rot) * 0.6)) scale(1); }
            100% { opacity: 0; transform: translate(calc(var(--dx) * 1.15), var(--down)) rotate(var(--rot)) scale(0.85); }
          }
        `}</style>
        {showOops && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(243,232,214,0.92)", borderRadius: 24, zIndex: 5, animation: "oopsPop 1.6s ease forwards" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 46 }}>😮</div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: 34, fontWeight: 700, color: COLORS.primary }}>Oops!</div>
              <div style={{ fontSize: 14, color: "#6B5B4E", marginTop: 4 }}>Let's watch it again</div>
            </div>
          </div>
        )}
        {phase === "success" && <Confetti burstKey={confettiKey} />}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, width: "100%", maxWidth: 320 }}>
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => handlePadTap(pad.id)}
                disabled={phase !== "input"}
                style={{
                  aspectRatio: "1",
                  borderRadius: 24,
                  border: "none",
                  fontSize: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: phase === "input" ? "pointer" : "default",
                  background: isActive ? pad.lit : COLORS.padOff,
                  boxShadow: isActive ? `0 0 0 6px ${pad.lit}33, 0 6px 16px rgba(61,40,23,0.30)` : "inset 0 2px 4px rgba(0,0,0,0.25)",
                  transition: "background 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.55 }}>{pad.icon}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "18px 24px 4px" }}>
        <div style={{ background: "#F6E1CC", borderRadius: 18, padding: "12px 18px", fontSize: 15, fontWeight: 600, textAlign: "center", color: COLORS.primary }}>
          {message}
        </div>
      </div>
      <div style={{ padding: "14px 24px 26px", textAlign: "center" }}>
        {phase === "idle" && (
          <button onClick={startRound} style={{ background: COLORS.primary, color: "#FFFFFF", border: "none", borderRadius: 16, padding: "14px 32px", fontSize: 16, fontWeight: 700, fontFamily: FONT_HEAD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Play size={18} /> Play Pattern (Lvl {currentLevel})
          </button>
        )}
        {phase === "showing" && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#6B5B4E", fontSize: 13 }}>
            <Volume2 size={16} /> Watch and listen...
          </div>
        )}
        {phase === "success" && (
          <button onClick={startRound} style={{ background: COLORS.accent, color: "#FFFFFF", border: "none", borderRadius: 16, padding: "14px 32px", fontSize: 16, fontWeight: 700, fontFamily: FONT_HEAD, cursor: "pointer" }}>
            Try Next Level
          </button>
        )}
      </div>
    </div>
  );
}
