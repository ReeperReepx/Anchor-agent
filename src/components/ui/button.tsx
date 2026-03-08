import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0071E3] text-white hover:bg-[#0077ED] active:bg-[#005BB5] shadow-[0_2px_12px_rgba(0,113,227,0.3)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.4)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]",
  secondary:
    "border border-[#E5E5E5] text-[#1D1D1F] hover:bg-[#F0F0F0] hover:border-[#86868B] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97]",
  ghost:
    "text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F0F0F0] active:scale-[0.97]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[13px] min-h-[36px]",
  md: "px-5 py-2.5 text-sm min-h-[40px]",
  lg: "px-8 py-3.5 text-base min-h-[48px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className = "", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="spinner spinner-sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
