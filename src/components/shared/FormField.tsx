import { ReactNode } from "react";
import { focusRingClasses } from "@/lib/a11y";

interface FormFieldProps {
  label: string;
  inputId: string;
  error?: string;
  children: ReactNode;
  className?: string;
  helperText?: string;
}

export function FormField({
  label,
  inputId,
  error,
  children,
  className = "",
  helperText,
}: FormFieldProps) {
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-[14px] font-semibold text-[#262626]"
      >
        {label}
      </label>
      <div {...(error ? { "aria-describedby": errorId, "aria-invalid": true } : {})}>
        {children}
      </div>
      {error && (
        <div
          id={errorId}
          role="alert"
          className="text-[12px] font-medium text-[#d7263d]"
        >
          {error}
        </div>
      )}
      {helperText && !error && (
        <div id={helperId} className="text-[12px] text-[#767676]">
          {helperText}
        </div>
      )}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function TextInput({ error, ...props }: TextInputProps) {
  return (
    <input
      type="text"
      className={`w-full px-3 py-2 border rounded-[8px] text-[16px] ${
        error ? "border-[#d7263d]" : "border-[#e5e3e0]"
      } focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:ring-offset-2 ${focusRingClasses}`}
      {...props}
    />
  );
}
