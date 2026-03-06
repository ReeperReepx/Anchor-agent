import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#B85C42] text-white hover:bg-[#D4917F] active:bg-[#9A4E36] shadow-[0_2px_12px_rgba(184,92,66,0.3)] hover:shadow-[0_4px_16px_rgba(184,92,66,0.4)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]",
  secondary:
    "border border-[#E5E5E5] text-[#1D1D1F] hover:bg-[#F0F0F0] hover:border-[#6B7280] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]",
  ghost:
    "text-[#6B7280] hover:text-[#1D1D1F] hover:bg-[#F0F0F0] active:scale-[0.97]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-[12px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B85C42] disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
