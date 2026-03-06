interface RadioCardProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function RadioCard({ label, description, selected, onClick }: RadioCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-[12px] border transition-all ${
        selected
          ? "border-[#B85C42] bg-[rgba(184,92,66,0.08)]"
          : "border-[#E5E5E5] bg-white hover:border-[#6B7280]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={`text-sm font-semibold ${
              selected ? "text-[#1D1D1F]" : "text-[#4B5563]"
            }`}
          >
            {label}
          </div>
          <div className="text-[13px] text-[#6B7280] mt-0.5">{description}</div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-[#B85C42]" : "border-[#E5E5E5]"
          }`}
        >
          {selected && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#B85C42]" />
          )}
        </div>
      </div>
    </button>
  );
}
