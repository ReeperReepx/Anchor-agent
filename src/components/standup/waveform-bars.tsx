"use client";

import { useState, useEffect } from "react";

export function WaveformBars({ active, getVolume }: { active: boolean; getVolume?: () => number }) {
  const [levels, setLevels] = useState<number[]>(Array(20).fill(8));

  useEffect(() => {
    if (!active || !getVolume) return;
    const interval = setInterval(() => {
      const vol = getVolume();
      setLevels(
        Array.from({ length: 20 }, (_, i) => {
          const base = vol * 64;
          const variance = Math.sin(Date.now() / 200 + i * 0.5) * 12;
          return Math.max(4, Math.min(64, base + variance));
        })
      );
    }, 80);
    return () => clearInterval(interval);
  }, [active, getVolume]);

  return (
    <div className="flex items-center justify-center gap-[3px] h-16 my-8">
      {levels.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-100 ${active ? "bg-[#FF9500]" : "bg-[#E5E5E5]"}`}
          style={{ height: active ? `${h}px` : "8px" }}
        />
      ))}
    </div>
  );
}
