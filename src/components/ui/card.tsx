import { HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-[14px] border border-[#E5E5E5] bg-white p-[28px] shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.03)] transition-shadow duration-200 ${className}`}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-base font-semibold text-[#1D1D1F] leading-[1.4] ${className}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
