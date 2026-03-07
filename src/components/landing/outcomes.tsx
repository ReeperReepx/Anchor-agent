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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B85C42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    stat: "5 min",
    statLabel: "to unblock your day",
  },
];

export function StatsBar() {
  return (
    <section className="px-5 sm:px-10 py-12 sm:py-[60px] border-t border-[#E5E5E5]">
      <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-[36px] sm:text-[44px] font-bold text-[#B85C42] tracking-[-0.02em]">
              {stat.value}
            </div>
            <p className="text-sm text-[#6B7280] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OutcomeCards() {
  return (
    <section className="px-5 sm:px-10 py-12 sm:py-[60px] max-w-[960px] mx-auto">
      <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-4 text-center">
        What actually changes
      </h2>
      <p className="text-center text-[#6B7280] text-[15px] mb-10 sm:mb-14 max-w-[440px] mx-auto">
        Five minutes of talking replaces hours of drifting. Here&apos;s what happens when you show up.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {OUTCOMES.map((outcome) => (
          <div
            key={outcome.title}
            className="relative bg-white rounded-[14px] p-7 border border-[#E5E5E5] hover:border-[#B85C42]/40 transition-colors group overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B85C42]/0 to-transparent group-hover:via-[#B85C42]/60 transition-all" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-[10px] bg-[rgba(184,92,66,0.1)] flex items-center justify-center shrink-0">
                {outcome.icon}
              </div>
              <h4 className="text-[15px] font-semibold text-[#1D1D1F]">
                {outcome.title}
              </h4>
            </div>
            <p className="text-[13px] text-[#6B7280] leading-[1.6] mb-5">
              {outcome.description}
            </p>
            <div className="pt-4 border-t border-[#E5E5E5]">
              <span className="text-[22px] font-bold text-[#B85C42]">
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
