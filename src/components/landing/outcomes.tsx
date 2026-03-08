const STATS = [
  { value: "5 min", label: "daily standup, voice-first" },
  { value: "3", label: "questions to lock in your day" },
  { value: "$0", label: "for your first 7 days" },
];

const OUTCOMES = [
  {
    title: "Track your wins",
    description:
      "Every standup is saved. Searchable. A running record that proves you're shipping — not just busy.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    stat: "100%",
    statLabel: "of standups saved & searchable",
  },
  {
    title: "Lock in your priorities",
    description:
      "Say it out loud, commit to it. Speaking your plan creates real accountability — no more vague to-do lists.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    stat: "3",
    statLabel: "focused questions daily",
  },
  {
    title: "Kill your blockers",
    description:
      "Name what's in the way. Saying it out loud forces clarity. The AI helps you break it down.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    stat: "5 min",
    statLabel: "to unblock your day",
  },
];

export function StatsBar() {
  return (
    <section className="px-5 sm:px-10 py-16 sm:py-20">
      <div className="max-w-[900px] mx-auto grid grid-cols-3 gap-4 sm:gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-[32px] sm:text-[48px] font-bold text-[#1D1D1F] tracking-[-0.03em]">
              {stat.value}
            </div>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OutcomeCards() {
  return (
    <section className="px-5 sm:px-10 py-16 sm:py-20 max-w-[960px] mx-auto">
      <p className="text-center text-xs font-semibold tracking-[0.15em] uppercase text-[#B85C42] mb-3">
        Results
      </p>
      <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.025em] text-[#1D1D1F] mb-4 text-center leading-tight">
        What actually changes
      </h2>
      <p className="text-center text-[#6B7280] text-sm sm:text-base mb-12 sm:mb-16 max-w-[460px] mx-auto leading-relaxed">
        Five minutes of talking replaces hours of drifting.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {OUTCOMES.map((outcome) => (
          <div
            key={outcome.title}
            className="relative bg-white rounded-xl p-6 sm:p-7 border border-[#E5E5E5] hover:border-[#D4917F]/60 hover:shadow-[0_8px_40px_rgba(184,92,66,0.08)] transition-all duration-300 group"
          >
            <div className="w-11 h-11 rounded-xl bg-[rgba(184,92,66,0.08)] text-[#B85C42] flex items-center justify-center mb-5 group-hover:bg-[rgba(184,92,66,0.12)] transition-colors">
              {outcome.icon}
            </div>
            <h4 className="text-[15px] font-semibold text-[#1D1D1F] mb-2">
              {outcome.title}
            </h4>
            <p className="text-[13px] text-[#6B7280] leading-[1.65] mb-5">
              {outcome.description}
            </p>
            <div className="pt-4 border-t border-[#E5E5E5]">
              <span className="text-xl font-bold text-[#B85C42]">
                {outcome.stat}
              </span>
              <span className="text-[12px] text-[#9CA3AF] ml-2">
                {outcome.statLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
