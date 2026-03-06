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
    <section className="px-10 py-[60px] max-w-[960px] mx-auto">
      <h2 className="text-[36px] font-bold tracking-[-0.02em] text-[#2C2825] mb-14 text-center">
        What builders are saying
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="bg-white rounded-[14px] p-7 border border-[#E8DDD3] hover:border-[#C4654A]/40 transition-colors"
          >
            <p className="text-[14px] italic text-[#2C2825] leading-[1.7] mb-6">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[rgba(196,101,74,0.15)] text-[#C4654A] flex items-center justify-center text-xs font-semibold shrink-0">
                {t.initials}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#2C2825]">
                  {t.name}
                </p>
                <p className="text-[12px] text-[#a89a8e]">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
