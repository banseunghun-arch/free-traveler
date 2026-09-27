"use client";

import { useEffect, useState } from "react";
import * as React from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-[#e6f6ef]"
      : type === "error"
        ? "bg-[#fff4e0]"
        : "bg-white";

  const borderColor =
    type === "success"
      ? "border-[#1a7f5a]"
      : type === "error"
        ? "border-[#b45309]"
        : "border-[#e5e3e0]";

  const textColor =
    type === "success"
      ? "text-[#1a7f5a]"
      : type === "error"
        ? "text-[#b45309]"
        : "text-[#262626]";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm ${bgColor} border ${borderColor} rounded-[8px] p-4 shadow-lg ${textColor} text-[14px] font-medium animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {message}
    </div>
  );
}

interface ToastContextType {
  show: (message: string, type?: "success" | "error" | "info") => void;
}

export const ToastContext = React.createContext<ToastContextType>({
  show: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const show = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setToast({ message, type });
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}
