import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

const VALUE_PROPS = [
  {
    heading: "Know how productive you are everyday",
    body: "Track your daily output, spot patterns, and see exactly where your time goes.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    heading: "Voice-first, zero typing",
    body: "Talk through your day like you would with a co-founder. No forms, just speak.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
      </svg>
    ),
  },
  {
    heading: "AI that actually helps",
    body: "Summaries, patterns, and blocker detection, all automatic, all searchable.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

export function Testimonials() {
  return (
    <section className="px-5 sm:px-10 py-16 sm:py-24 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-[5vw] items-start">
        {/* Left — sticky heading (2 cols) */}
        <div className="md:col-span-2 md:sticky md:top-24">
          <ScrollReveal>
            <p className="text-[#0071E3] text-sm font-semibold mb-3 tracking-wide">
              Why Anchor
            </p>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.035em] text-[#1d1d1f] leading-tight">
              Why builders
              <br />
              choose Anchor.
            </h2>
            <p className="text-[#86868b] text-base mt-3 leading-relaxed max-w-[320px]">
              The accountability tool that fits how you already work.
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white px-7 py-3 rounded-full text-[14px] font-semibold transition-colors w-full sm:w-auto min-h-[48px]"
              >
                Start your free trial
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Right — cards stacked (3 cols) */}
        <div className="md:col-span-3 space-y-4">
          {VALUE_PROPS.map((prop, i) => (
            <ScrollReveal key={prop.heading} delay={i * 100}>
              <div className="flex gap-5 items-start rounded-2xl bg-[#f5f5f7] p-6 sm:p-7 hover:bg-[#e8e8ed] transition-colors duration-300">
                <div className="w-11 h-11 rounded-xl bg-white text-[#1d1d1f] flex items-center justify-center shrink-0 shadow-sm">
                  {prop.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">
                    {prop.heading}
                  </h3>
                  <p className="text-[14px] text-[#86868b] leading-relaxed">
                    {prop.body}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
