const STATS = [
  { value: "91%", label: "of daily priorities completed" },
  { value: "23", label: "day average streak" },
  { value: "2.3x", label: "more likely to hit weekly goals" },
];

const OUTCOMES = [
  {
    title: "Track your wins",
    description:
      "Every standup is saved. Searchable. A running record that proves you're shipping — not just busy.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4654A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      "Say it out loud, commit to it. Users who speak their plan follow through 91% of the time.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4654A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    stat: "91%",
    statLabel: "follow-through rate",
  },
  {
    title: "Kill your blockers",
    description:
      "Name what's in the way. Saying it out loud forces clarity. The AI helps you break it down.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4654A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    stat: "5 min",
    statLabel: "to unblock your day",
  },
];

export function StatsBar() {
  return (
    <section className="px-10 py-[60px] border-t border-[#E8DDD3]">
      <div className="max-w-[900px] mx-auto flex justify-center gap-16">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-[44px] font-bold text-[#C4654A] tracking-[-0.02em]">
              {stat.value}
            </div>
            <p className="text-sm text-[#8a7e74] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OutcomeCards() {
  return (
    <section className="px-10 py-[60px] max-w-[960px] mx-auto">
      <h2 className="text-[36px] font-bold tracking-[-0.02em] text-[#2C2825] mb-4 text-center">
        What actually changes
      </h2>
      <p className="text-center text-[#8a7e74] text-[15px] mb-14 max-w-[440px] mx-auto">
        Five minutes of talking replaces hours of drifting. Here&apos;s what happens when you show up.
      </p>
      <div className="grid grid-cols-3 gap-5">
        {OUTCOMES.map((outcome) => (
          <div
            key={outcome.title}
            className="relative bg-white rounded-[14px] p-7 border border-[#E8DDD3] hover:border-[#C4654A]/40 transition-colors group overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C4654A]/0 to-transparent group-hover:via-[#C4654A]/60 transition-all" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-[10px] bg-[rgba(196,101,74,0.1)] flex items-center justify-center shrink-0">
                {outcome.icon}
              </div>
              <h4 className="text-[15px] font-semibold text-[#2C2825]">
                {outcome.title}
              </h4>
            </div>
            <p className="text-[13px] text-[#8a7e74] leading-[1.6] mb-5">
              {outcome.description}
            </p>
            <div className="pt-4 border-t border-[#E8DDD3]">
              <span className="text-[22px] font-bold text-[#C4654A]">
                {outcome.stat}
              </span>
              <span className="text-[12px] text-[#a89a8e] ml-2">
                {outcome.statLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
