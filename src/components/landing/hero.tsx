import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Waveform } from "./waveform";

export function Hero() {
  return (
    <section className="px-10 pt-[100px] pb-20 max-w-3xl mx-auto text-center">
      <h1 className="text-[52px] font-bold tracking-[-0.02em] leading-[1.15] text-[#1D1D1F]">
        Five minutes. Three questions.
        <br />
        <span className="text-[#B85C42]">Every damn day.</span>
      </h1>
      <p className="mt-6 text-lg text-[#6B7280] max-w-[500px] mx-auto leading-relaxed">
        The voice-first standup for solopreneurs who ship. No typing, no
        dashboards, no excuses.
      </p>
      <div className="mt-8">
        <Link href="/login">
          <Button size="lg" className="gap-2.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
            Get Early Access — Free
          </Button>
        </Link>
      </div>
      <div className="mt-8">
        <Waveform />
      </div>
    </section>
  );
}
