import { ScrollReveal } from "./scroll-reveal";

const TICKER_ITEMS = [
  "5-Minute Standups",
  "Voice-First",
  "AI Summaries",
  "Streak Tracking",
  "Zero Typing",
  "Blocker Detection",
  "Weekly Planning",
  "Accountability Partner",
  "Searchable History",
  "Pattern Insights",
];

export function StatsBar() {
  return (
    <section className="py-4 sm:py-5 border-y border-[#e5e5e5] overflow-hidden bg-[#fafafa]">
      <div
        className="flex gap-8 sm:gap-12 whitespace-nowrap"
        style={{ animation: "ticker 30s linear infinite", width: "max-content" }}
      >
        {/* Duplicate items for seamless loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-[13px] sm:text-[14px] text-[#86868b] font-medium">
            <svg className="w-3.5 h-3.5 text-[#FF9500] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export function OutcomeCards() {
  return (
    <section className="px-5 sm:px-10 py-16 sm:py-24 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left — copy */}
        <ScrollReveal>
          <div>
            <p className="text-[#FF9500] text-sm font-semibold mb-3 tracking-wide">
              Results
            </p>
            <h2 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.035em] text-[#1d1d1f] leading-tight">
              Every standup saved.
              <br />
              <span className="text-[#86868b]">Every win tracked.</span>
            </h2>
            <p className="text-[#86868b] text-base sm:text-lg mt-4 max-w-[420px] leading-relaxed">
              AI summaries, pattern detection, and a searchable history of everything you ship. Five minutes in, clarity out.
            </p>
          </div>
        </ScrollReveal>

        {/* Right — streak calendar */}
        <ScrollReveal direction="right">
          <div className="bg-[#f5f5f7] rounded-2xl p-6 sm:p-8 max-w-[340px] mx-auto md:ml-auto md:mr-0">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[15px] font-semibold text-[#1d1d1f]">Your streak</div>
              <div className="text-[13px] text-[#86868b]">March 2026</div>
            </div>
            <div className="grid grid-cols-7 gap-[6px]">
              {["M","Tu","W","Th","F","Sa","Su"].map((d) => (
                <div key={d} className="text-[10px] text-[#86868b] text-center font-medium pb-1">{d.charAt(0)}</div>
              ))}
              {/* 0=missed, 1=low, 2=medium, 3=high, 4=today */}
              {[3,2,3,1,3,0,2, 3,2,3,3,0,1,2, 3,2,1,3,2,3,4, 3,2,3,1,0,2,3].map((level, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-[6px] ${
                    level === 4
                      ? "bg-[#FF9500] ring-2 ring-[#FF9500]/30"
                      : level === 3
                      ? "bg-[#FF9500]"
                      : level === 2
                      ? "bg-[#FF9500]/60"
                      : level === 1
                      ? "bg-[#FF9500]/30"
                      : "bg-[#e5e5e5]"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-end gap-1 mt-3">
              <span className="text-[9px] text-[#86868b]">Less</span>
              <div className="w-3 h-3 rounded-[3px] bg-[#FF9500]/30" />
              <div className="w-3 h-3 rounded-[3px] bg-[#FF9500]/60" />
              <div className="w-3 h-3 rounded-[3px] bg-[#FF9500]" />
              <span className="text-[9px] text-[#86868b]">More</span>
            </div>
            <div className="mt-5 pt-4 border-t border-[#e5e5e5] flex items-center justify-between">
              <div>
                <div className="text-[28px] font-bold text-[#1d1d1f] tracking-tight leading-none">26</div>
                <div className="text-[12px] text-[#86868b] mt-0.5">day streak</div>
              </div>
              <div className="text-right">
                <div className="text-[28px] font-bold text-[#34C759] tracking-tight leading-none">85%</div>
                <div className="text-[12px] text-[#86868b] mt-0.5">consistency</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
