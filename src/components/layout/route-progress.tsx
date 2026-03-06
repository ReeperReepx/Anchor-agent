"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(30);
    const t1 = setTimeout(() => setProgress(60), 100);
    const t2 = setTimeout(() => setProgress(80), 200);
    const t3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px]">
      <div
        className="h-full bg-[#B85C42] transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
