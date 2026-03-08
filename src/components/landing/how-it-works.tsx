"use client";

import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 sm:px-10 py-16 sm:py-24 bg-[#000000]">
      <ScrollReveal>
        <div className="text-center mb-8 sm:mb-10 max-w-[1080px] mx-auto">
          <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.035em] text-[#f5f5f7]">
            See it in action
          </h2>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        {/* App window frame */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden max-w-[720px] mx-auto shadow-sm">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            <span className="text-[12px] text-[#86868b] ml-3 font-medium">Anchor | Daily Standup</span>
          </div>

          {/* App content */}
          <div className="p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Left — live conversation */}
            <div className="bg-[#f5f5f7] rounded-xl p-4 border border-[#e5e5e5]/80">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#0071E3] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                </div>
                <span className="text-[12px] font-semibold text-[#1d1d1f]">Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse ml-auto" />
              </div>
              <div className="space-y-2.5">
                <div className="bg-white rounded-lg rounded-bl-sm px-3 py-2 text-[12px] text-[#1d1d1f] max-w-[85%]">
                  What did you ship yesterday?
                </div>
                <div className="bg-[#0071E3] rounded-lg rounded-br-sm px-3 py-2 text-[12px] text-white max-w-[85%] ml-auto">
                  Finished onboarding and fixed auth bugs
                </div>
                <div className="bg-white rounded-lg rounded-bl-sm px-3 py-2 text-[12px] text-[#1d1d1f] max-w-[85%]">
                  What&apos;s the plan for today?
                </div>
                <div className="bg-[#0071E3] rounded-lg rounded-br-sm px-3 py-2 text-[12px] text-white max-w-[85%] ml-auto">
                  Stripe integration and pricing page
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e5e5e5]">
                <div className="w-5 h-5 rounded-full bg-[#0071E3]/10 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="2.5">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                </div>
                <div className="flex items-center gap-[2px] flex-1">
                  {[3,5,8,11,14,16,17,16,14,11,8,5,3].map((h, i) => (
                    <div key={i} className="w-[2px] rounded-full bg-[#0071E3]" style={{ height: `${h}px`, opacity: 0.4 + (h / 30) }} />
                  ))}
                </div>
                <span className="text-[10px] text-[#86868b] tabular-nums">3:42</span>
              </div>
            </div>

            {/* Right — AI summary output */}
            <div className="bg-[#f5f5f7] rounded-xl p-4 border border-[#e5e5e5]/80">
              <div className="flex items-center gap-2 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="1.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <span className="text-[12px] font-semibold text-[#1d1d1f]">AI Summary</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider mb-1">Yesterday</div>
                  <p className="text-[12px] text-[#6e6e73] leading-relaxed">Shipped onboarding flow, fixed 2 auth bugs</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#34C759] uppercase tracking-wider mb-1">Today</div>
                  <p className="text-[12px] text-[#6e6e73] leading-relaxed">Stripe checkout integration, pricing page</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#FF9F0A] uppercase tracking-wider mb-1">Blockers</div>
                  <p className="text-[12px] text-[#6e6e73] leading-relaxed">Waiting on webhook keys, using test mode</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e5e5e5] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[11px] text-[#86868b]">12-day streak</span>
                </div>
                <span className="text-[10px] text-[#86868b]">5m 12s</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-[#0071E3] hover:bg-[#0077ED] text-white px-8 py-3 rounded-full text-[14px] font-semibold transition-colors min-h-[48px]"
          >
            Start free trial
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
