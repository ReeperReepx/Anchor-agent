import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Waveform } from "./waveform";

export function Hero() {
  return (
    <section className="px-5 sm:px-10 pt-16 sm:pt-[80px] pb-16 sm:pb-20 max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-full px-4 py-1.5 text-[12px] font-medium text-[#6B7280] mb-6 sm:mb-8 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#2D8A56] animate-pulse" />
        7-day free trial
      </div>
      <h1 className="text-[32px] sm:text-[44px] md:text-[52px] font-bold tracking-[-0.025em] leading-[1.1] text-[#1D1D1F]">
        Five minutes. Three questions.
        <br />
        <span className="bg-gradient-to-r from-[#B85C42] to-[#D4917F] bg-clip-text text-transparent">Every damn day.</span>
      </h1>
      <p className="mt-5 sm:mt-6 text-base sm:text-lg text-[#6B7280] max-w-[480px] mx-auto leading-relaxed">
        The voice-first standup for solopreneurs who ship. No typing, no
        dashboards, no excuses.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3">
        <Link href="/login">
          <Button size="lg" className="gap-2.5 shadow-[0_4px_20px_rgba(184,92,66,0.3)]">
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
            Start Free Trial
          </Button>
        </Link>
        <span className="text-[12px] text-[#9CA3AF]">7 days free, then from $20/mo</span>
      </div>
      <div className="mt-10">
        <Waveform />
      </div>
    </section>
  );
}
