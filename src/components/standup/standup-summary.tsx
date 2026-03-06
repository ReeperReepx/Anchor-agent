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
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-[1px] mb-1">
            Done
          </p>
          <p className="text-sm text-[#4B5563] leading-relaxed">{done}</p>
        </div>
      )}
      {planned && (
        <div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-[1px] mb-1">
            Planned
          </p>
          <p className="text-sm text-[#4B5563] leading-relaxed">{planned}</p>
        </div>
      )}
      {blockers && (
        <div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-[1px] mb-1">
            Blockers
          </p>
          <p className="text-sm text-[#4B5563] leading-relaxed">{blockers}</p>
        </div>
      )}
    </div>
  );
}
