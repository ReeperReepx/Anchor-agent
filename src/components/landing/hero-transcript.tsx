"use client";

import { useEffect, useState } from "react";

const BUBBLES = [
  {
    role: "ai" as const,
    text: "What did you ship yesterday?",
    // top-right area
    className: "top-[2%] right-[0%] md:rotate-[2deg]",
  },
  {
    role: "user" as const,
    text: "Finished the onboarding flow and fixed two auth bugs.",
    className: "top-[18%] right-[0%] md:right-[5%] md:-rotate-[1deg]",
  },
  {
    role: "ai" as const,
    text: "Nice. What's the plan for today?",
    className: "top-[36%] left-[0%] md:rotate-[1.5deg]",
  },
  {
    role: "user" as const,
    text: "Stripe integration and the pricing page.",
    className: "top-[52%] right-[0%] md:right-[2%] md:-rotate-[2deg]",
  },
  {
    role: "ai" as const,
    text: "Any blockers?",
    className: "top-[68%] left-[0%] md:left-[5%] md:rotate-[1deg]",
  },
  {
    role: "user" as const,
    text: "Waiting on webhook keys, using test mode for now.",
    className: "top-[80%] right-[0%] md:-rotate-[1.5deg]",
  },
];

// Pre-computed waveform values
const WAVE_BARS = [4, 7, 10, 13, 15, 17, 18, 19, 20, 19, 18, 17, 15, 13, 10, 7, 4];
const WAVE_OPACITIES = [30, 40, 50, 55, 65, 70, 75, 78, 80, 78, 75, 70, 65, 55, 50, 40, 30];

export function HeroTranscript() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= BUBBLES.length) return;
    const timer = setTimeout(() => setVisible((v) => v + 1), 700);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div className="relative w-full h-[420px] sm:h-[460px]">
      {/* Floating bubbles */}
      {BUBBLES.slice(0, visible).map((bubble, i) => (
        <div
          key={i}
          className={`absolute max-w-[280px] sm:max-w-[300px] ${bubble.className} hero-bubble`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div
            className={`px-4 py-2.5 text-[13px] sm:text-[14px] leading-relaxed rounded-2xl shadow-lg backdrop-blur-sm ${
              bubble.role === "user"
                ? "bg-[#FF9500] text-white shadow-[#FF9500]/20"
                : "bg-white text-[#1d1d1f] shadow-black/8 border border-[#e5e5e5]/60"
            }`}
          >
            {bubble.role === "ai" && (
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-[#FF9500] flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">Anchor AI</span>
              </div>
            )}
            {bubble.text}
          </div>
        </div>
      ))}

      {/* Typing indicator while loading */}
      {visible < BUBBLES.length && visible > 0 && (
        <div
          className={`absolute ${BUBBLES[visible].className} hero-bubble`}
        >
          <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#e5e5e5]/60 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: "0s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: "0.15s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      )}

      {/* Voice waveform at bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg border border-[#e5e5e5]/60 hero-bubble" style={{ animationDelay: "0.2s" }}>
        <div className="w-8 h-8 rounded-full bg-[#FF9500] flex items-center justify-center shrink-0 animate-pulse">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
        </div>
        <div className="flex items-center gap-[3px]">
          {WAVE_BARS.map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-[#FF9500] shrink-0"
              style={{
                height: `${h}px`,
                opacity: WAVE_OPACITIES[i] / 100,
                animation: "wave 1.8s ease-in-out infinite",
                animationDelay: `${i * 0.07}s`,
              }}
            />
          ))}
        </div>
        <span className="text-[12px] text-[#86868b] font-medium tabular-nums shrink-0">4:32</span>
      </div>
    </div>
  );
}
