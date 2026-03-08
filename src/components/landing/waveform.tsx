"use client";

const BARS = Array.from({ length: 16 }, (_, i) => ({
  delay: `${i * 0.08}s`,
  opacity: i % 3 === 0 ? 0.4 : 0.7,
}));

export function Waveform() {
  return (
    <div className="flex items-center justify-center gap-[3px] h-10" aria-hidden="true">
      {BARS.map((bar, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            backgroundColor: "#D4917F",
            opacity: bar.opacity,
            animation: `wave 1.4s ease-in-out infinite`,
            animationDelay: bar.delay,
            height: "6px",
          }}
        />
      ))}
    </div>
  );
}
