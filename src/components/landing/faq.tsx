"use client";

import { useState } from "react";
import { ScrollReveal } from "./scroll-reveal";

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
    <section className="px-5 sm:px-10 py-16 sm:py-24 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-[5vw]">
        {/* Left heading (2 cols) */}
        <div className="md:col-span-2">
          <ScrollReveal>
            <p className="text-[#0071E3] text-sm font-semibold mb-3 tracking-wide">
              FAQ
            </p>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.035em] text-[#1d1d1f] leading-tight">
              Questions?
              <br />
              Answers.
            </h2>
          </ScrollReveal>
        </div>

        {/* Right — accordion (3 cols) */}
        <div className="md:col-span-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <ScrollReveal key={item.q} delay={i * 50}>
                <div className="border-b border-[#d2d2d7]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-4 sm:py-5 text-left group min-h-[48px]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-[#1d1d1f] text-[15px] sm:text-[16px] pr-4 group-hover:text-[#0071E3] transition-colors">
                      {item.q}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[#86868b] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[14px] text-[#86868b] leading-relaxed pr-10">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
