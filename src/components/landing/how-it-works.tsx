const STEPS = [
  {
    number: 1,
    title: "Tap the mic",
    description:
      "Open Anchor and start a voice session. No typing required.",
  },
  {
    number: 2,
    title: "Answer 3 questions",
    description:
      "What you did, what's next, what's blocking you. 5 minutes.",
  },
  {
    number: 3,
    title: "Track your streak",
    description:
      "AI-generated summaries, patterns, and accountability insights.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 sm:px-10 py-12 sm:py-[60px] max-w-[960px] mx-auto">
      <p className="text-center text-xs font-semibold tracking-[0.15em] uppercase text-[#9CA3AF] mb-3">
        How It Works
      </p>
      <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-10 sm:mb-14 text-center">
        Three steps. Zero friction.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#B85C42] text-white flex items-center justify-center text-lg font-bold mb-5">
              {step.number}
            </div>
            <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-2">
              {step.title}
            </h3>
            <p className="text-[14px] text-[#6B7280] leading-[1.6] max-w-[260px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
