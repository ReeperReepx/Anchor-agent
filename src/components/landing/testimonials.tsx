const TESTIMONIALS = [
  {
    quote:
      "Five minutes every morning changed how I plan my entire day. I actually finish what I set out to do now.",
    name: "Sarah K.",
    role: "Indie maker",
    initials: "SK",
  },
  {
    quote:
      "The voice format forces me to be honest about what I actually shipped versus what I was just busy with.",
    name: "Marco R.",
    role: "SaaS founder",
    initials: "MR",
  },
  {
    quote:
      "I've tried every productivity app. This is the first one that stuck because it takes zero effort.",
    name: "Jess L.",
    role: "Freelance developer",
    initials: "JL",
  },
];

export function Testimonials() {
  return (
    <section className="px-5 sm:px-10 py-12 sm:py-[60px] max-w-[960px] mx-auto">
      <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-10 sm:mb-14 text-center">
        What builders are saying
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="bg-white rounded-[14px] p-7 border border-[#E5E5E5] hover:border-[#B85C42]/40 transition-colors"
          >
            <p className="text-[14px] italic text-[#1D1D1F] leading-[1.7] mb-6">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[rgba(184,92,66,0.15)] text-[#B85C42] flex items-center justify-center text-xs font-semibold shrink-0">
                {t.initials}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1D1D1F]">
                  {t.name}
                </p>
                <p className="text-[12px] text-[#9CA3AF]">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
