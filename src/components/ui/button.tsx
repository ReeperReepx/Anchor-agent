import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#C4654A] text-white hover:bg-[#D4856A] active:bg-[#A8503A] shadow-[0_2px_12px_rgba(196,101,74,0.3)] hover:shadow-[0_4px_16px_rgba(196,101,74,0.4)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]",
  secondary:
    "border border-[#E8DDD3] text-[#2C2825] hover:bg-[#F5F0E8] hover:border-[#8a7e74] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]",
  ghost:
    "text-[#8a7e74] hover:text-[#2C2825] hover:bg-[#F5F0E8] active:scale-[0.97]",
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
        className={`inline-flex items-center justify-center rounded-[12px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4654A] disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
