interface StandupSummaryProps {
  done: string | null;
  planned: string | null;
  blockers: string | null;
}

export function StandupSummary({ done, planned, blockers }: StandupSummaryProps) {
  return (
    <div className="space-y-3">
      {done && (
        <div>
          <p className="text-xs font-medium text-[#8a7e74] uppercase tracking-[1px] mb-1">
            Done
          </p>
          <p className="text-sm text-[#5a524a] leading-relaxed">{done}</p>
        </div>
      )}
      {planned && (
        <div>
          <p className="text-xs font-medium text-[#8a7e74] uppercase tracking-[1px] mb-1">
            Planned
          </p>
          <p className="text-sm text-[#5a524a] leading-relaxed">{planned}</p>
        </div>
      )}
      {blockers && (
        <div>
          <p className="text-xs font-medium text-[#8a7e74] uppercase tracking-[1px] mb-1">
            Blockers
          </p>
          <p className="text-sm text-[#5a524a] leading-relaxed">{blockers}</p>
        </div>
      )}
    </div>
  );
}
