import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#F5F0E8] text-[#8a7e74]",
  success: "bg-[rgba(45,138,86,0.1)] text-[#2D8A56]",
  warning: "bg-[rgba(196,144,10,0.1)] text-[#C4900A]",
  info: "bg-[rgba(59,111,196,0.1)] text-[#3B6FC4]",
};

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
