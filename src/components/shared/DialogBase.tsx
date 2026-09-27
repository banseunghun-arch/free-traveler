import { ReactNode, useEffect, useRef } from "react";
import { dialogRoleAttrs, focusRingClasses } from "@/lib/a11y";

interface DialogBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function DialogBase({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: DialogBaseProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus on dialog when opened
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    initialFocusRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        {...dialogRoleAttrs}
        className={`bg-white rounded-[16px] shadow-lg max-w-md w-full mx-4 ${className}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#e5e3e0]">
          <h2 className="text-[18px] font-semibold text-[#262626]">{title}</h2>
          <button
            ref={initialFocusRef}
            onClick={onClose}
            className={`text-[#767676] hover:text-[#262626] transition-colors ${focusRingClasses}`}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
