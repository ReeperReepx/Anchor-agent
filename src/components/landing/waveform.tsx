"use client";

const BARS = [
  { color: "#B85C42", delay: "0s" },
  { color: "#B85C42", delay: "0.1s" },
  { color: "#B85C42", delay: "0.2s" },
  { color: "#D4917F", delay: "0.3s" },
  { color: "#B85C42", delay: "0.4s" },
  { color: "#D4917F", delay: "0.5s" },
  { color: "#B85C42", delay: "0.6s" },
  { color: "#B85C42", delay: "0.7s" },
  { color: "#D4917F", delay: "0.8s" },
  { color: "#B85C42", delay: "0.9s" },
];

export function Waveform() {
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {BARS.map((bar, i) => (
        <div
          key={i}
          className="w-1 rounded-sm"
          style={{
            backgroundColor: bar.color,
            animation: `wave 1.2s ease-in-out infinite`,
            animationDelay: bar.delay,
            height: "8px",
          }}
        />
      ))}
    </div>
  );
}
