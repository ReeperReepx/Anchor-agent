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
          ? "border-[#C4654A] bg-[rgba(196,101,74,0.08)]"
          : "border-[#E8DDD3] bg-white hover:border-[#8a7e74]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={`text-sm font-semibold ${
              selected ? "text-[#2C2825]" : "text-[#5a524a]"
            }`}
          >
            {label}
          </div>
          <div className="text-[13px] text-[#8a7e74] mt-0.5">{description}</div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-[#C4654A]" : "border-[#E8DDD3]"
          }`}
        >
          {selected && (
            <div className="w-2.5 h-2.5 rounded-full bg-[#C4654A]" />
          )}
        </div>
      </div>
    </button>
  );
}
