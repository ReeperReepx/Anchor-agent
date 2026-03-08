import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Waveform } from "./waveform";

export function Hero() {
  return (
    <section className="px-5 sm:px-10 pt-20 sm:pt-28 pb-20 sm:pb-28 max-w-3xl mx-auto text-center relative">
      <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-1.5 text-[12px] font-medium text-[#8A8A8E] mb-8 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2D8A56] animate-pulse" />
        7-day free trial — no credit card
      </div>

      <h1 className="text-[36px] sm:text-[52px] md:text-[64px] font-bold tracking-[-0.035em] leading-[1.05] text-white">
        Five minutes.
        <br />
        Three questions.
        <br />
        <span className="bg-gradient-to-r from-[#D4917F] via-[#E8B4A2] to-[#D4917F] bg-clip-text text-transparent">
          Every damn day.
        </span>
      </h1>

      <p className="mt-6 sm:mt-8 text-base sm:text-lg text-[#8A8A8E] max-w-[500px] mx-auto leading-relaxed">
        The voice-first standup for solopreneurs who ship.
        <br className="hidden sm:block" />
        No typing, no dashboards, no excuses.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <Link href="/login">
          <Button size="lg" className="gap-2.5 text-base px-10 py-4 shadow-[0_4px_30px_rgba(184,92,66,0.4)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
            Start Free Trial
          </Button>
        </Link>
        <span className="text-[12px] text-[#6B6B70]">
          7 days free, then from $20/mo
        </span>
      </div>

      <div className="mt-14">
        <Waveform />
      </div>
    </section>
  );
}
