interface StandupSummaryProps {
  done: string | null;
  planned: string | null;
  blockers: string | null;
}

export function StandupSummary({ done, planned, blockers }: StandupSummaryProps) {
  return (
    <div className="space-y-3">
      {done && (
        <div className="border-l-2 border-[rgba(45,138,86,0.4)] pl-3 py-0.5">
          <p className="text-[12px] font-semibold text-[#2D8A56] mb-1">
            Done
          </p>
          <p className="text-sm text-[#4B5563] leading-relaxed">{done}</p>
        </div>
      )}
      {planned && (
        <div className="border-l-2 border-[rgba(59,111,196,0.4)] pl-3 py-0.5">
          <p className="text-[12px] font-semibold text-[#3B6FC4] mb-1">
            Planned
          </p>
          <p className="text-sm text-[#4B5563] leading-relaxed">{planned}</p>
        </div>
      )}
      {blockers && (
        <div className="border-l-2 border-[rgba(196,48,48,0.4)] pl-3 py-0.5">
          <p className="text-[12px] font-semibold text-[#C43030] mb-1">
            Blockers
          </p>
          <p className="text-sm text-[#4B5563] leading-relaxed">{blockers}</p>
        </div>
      )}
    </div>
  );
}
