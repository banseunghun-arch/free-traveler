import { ReactNode } from "react";
import { focusRingClasses } from "@/lib/a11y";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
  ...ariaProps
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-[8px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses =
    variant === "primary"
      ? "bg-[#d03e1b] text-white hover:bg-[#b23417]"
      : "bg-[#f7f6f4] text-[#262626] hover:bg-[#e5e3e0] border border-[#e5e3e0]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${focusRingClasses} ${className}`}
      {...ariaProps}
    >
      {children}
    </button>
  );
}
