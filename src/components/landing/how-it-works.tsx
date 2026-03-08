const STEPS = [
  {
    number: "01",
    title: "Tap the mic",
    description:
      "Open Anchor and start a voice session. No typing required — just talk.",
  },
  {
    number: "02",
    title: "Answer 3 questions",
    description:
      "What you did, what's next, what's blocking you. Five minutes max.",
  },
  {
    number: "03",
    title: "Track your streak",
    description:
      "AI-generated summaries, patterns, and accountability insights — automatically.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 sm:px-10 py-16 sm:py-20 max-w-[960px] mx-auto">
      <p className="text-center text-xs font-semibold tracking-[0.15em] uppercase text-[#B85C42] mb-3">
        How It Works
      </p>
      <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.025em] text-[#1D1D1F] mb-12 sm:mb-16 text-center leading-tight">
        Three steps. Zero friction.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
        {/* Connector line on desktop */}
        <div className="hidden md:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-[#E5E5E5]" />

        {STEPS.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center relative">
            <div className="w-12 h-12 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center text-sm font-mono font-bold mb-5 relative z-10 ring-4 ring-[#F8F7F4]">
              {step.number}
            </div>
            <h3 className="text-base font-semibold text-[#1D1D1F] mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-[260px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
