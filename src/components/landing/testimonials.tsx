import Link from "next/link";

const VALUE_PROPS = [
  {
    heading: "Built for solopreneurs",
    body: "No team features you'll never use. Anchor is designed for founders, freelancers, and indie makers who need to stay accountable to themselves.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    heading: "Voice-first, zero typing",
    body: "Talk through your day like you would with a co-founder. No forms, no text boxes — just speak and Anchor captures everything.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    heading: "AI that actually helps",
    body: "Your standups are summarized automatically. Track patterns, spot blockers early, and see your progress over time — all without extra work.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
];

export function Testimonials() {
  return (
    <section className="px-5 sm:px-10 py-12 sm:py-[60px] max-w-[960px] mx-auto">
      <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4 text-center">
        Why builders choose Anchor
      </h2>
      <p className="text-center text-[#6B7280] text-[15px] mb-10 sm:mb-14 max-w-[480px] mx-auto">
        The accountability tool that fits how you already work.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {VALUE_PROPS.map((prop) => (
          <div
            key={prop.heading}
            className="bg-white rounded-[14px] p-7 border border-[#E5E5E5] hover:border-[#B85C42]/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-[10px] bg-[rgba(184,92,66,0.1)] text-[#B85C42] flex items-center justify-center mb-5">
              {prop.icon}
            </div>
            <h3 className="text-[15px] font-semibold text-[#1D1D1F] mb-2">
              {prop.heading}
            </h3>
            <p className="text-[13px] text-[#6B7280] leading-[1.7]">
              {prop.body}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[#B85C42] hover:bg-[#D4917F] text-white px-6 py-3 rounded-[10px] text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(184,92,66,0.3)]"
        >
          Start Your Free Trial
        </Link>
      </div>
    </section>
  );
}
