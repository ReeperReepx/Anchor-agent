const FAQ_ITEMS = [
  {
    q: "Do I need to type anything?",
    a: "No. Everything is voice-first. The AI agent talks to you and you speak back naturally.",
  },
  {
    q: "How long does a standup take?",
    a: "Daily standups are 5-10 minutes. Weekly planning sessions are up to 45 minutes (Premium).",
  },
  {
    q: "What are shared standups?",
    a: "You get matched with an accountability partner. You each do your standup separately with the AI, then you can see each other's summaries.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, cancel from your settings at any time.",
  },
];

export function FAQ() {
  return (
    <section className="px-10 py-[60px] max-w-[600px] mx-auto border-t border-[#E8DDD3]">
      <h2 className="text-[36px] font-bold tracking-[-0.02em] text-[#2C2825] mb-10 text-center">
        FAQ
      </h2>
      <div className="space-y-6">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q}>
            <h3 className="font-semibold text-[#2C2825]">{item.q}</h3>
            <p className="mt-1 text-sm text-[#8a7e74] leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
