"use client";

const BARS = Array.from({ length: 24 }, (_, i) => ({
  delay: `${i * 0.06}s`,
  height: Math.sin((i / 23) * Math.PI) * 28 + 4,
}));

export function Waveform() {
  return (
    <div className="flex items-end justify-center gap-[4px] h-12" aria-hidden="true">
      {BARS.map((bar, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-[#0071E3]"
          style={{
            opacity: 0.2 + Math.sin((i / 23) * Math.PI) * 0.5,
            animation: `wave 1.8s ease-in-out infinite`,
            animationDelay: bar.delay,
            height: `${bar.height}px`,
          }}
        />
      ))}
    </div>
  );
}
