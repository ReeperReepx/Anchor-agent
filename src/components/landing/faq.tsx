"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Do I need to type anything?",
    a: "No. Everything is voice-first. The AI agent talks to you and you speak back naturally.",
  },
  {
    q: "How long does a standup take?",
    a: "Daily standups are 5-10 minutes. Weekly planning sessions are up to 45 minutes (Founder plan).",
  },
  {
    q: "What are shared standups?",
    a: "You get matched with an accountability partner. You each do your standup separately with the AI, then you can see each other's summaries.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, cancel from your settings at any time.",
  },
  {
    q: "What happens after the free trial?",
    a: "You'll be charged for the plan you selected. You can cancel or switch plans before the trial ends to avoid being charged.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-5 sm:px-10 py-16 sm:py-20 max-w-[640px] mx-auto">
      <p className="text-center text-xs font-semibold tracking-[0.15em] uppercase text-[#B85C42] mb-3">
        FAQ
      </p>
      <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.025em] text-[#1D1D1F] mb-10 sm:mb-12 text-center leading-tight">
        Questions? Answers.
      </h2>
      <div className="space-y-0 border-t border-[#E5E5E5]">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-[#E5E5E5]">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-[#1D1D1F] text-[15px] pr-4 group-hover:text-[#B85C42] transition-colors">
                  {item.q}
                </span>
                <svg
                  className={`w-5 h-5 text-[#9CA3AF] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              {isOpen && (
                <div className="pb-5 animate-fade-in">
                  <p className="text-sm text-[#6B7280] leading-relaxed pr-8">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
