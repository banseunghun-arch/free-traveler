import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message: string;
  steps?: Array<{ step: number; description: string }>;
  ctaLabel?: string;
  ctaOnClick?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  message,
  steps,
  ctaLabel,
  ctaOnClick,
  icon,
}: EmptyStateProps) {
  if (process.env.NODE_ENV === "development") {
    if (!title || !message) {
      console.warn(
        "EmptyState: title and message are required and must not be empty",
      );
    }
    if (!ctaLabel || !ctaOnClick) {
      console.warn(
        "EmptyState: CTA button requires both ctaLabel and ctaOnClick",
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}

      <h3 className="text-[18px] font-semibold text-[#262626] mb-2">{title}</h3>
      <p className="text-[16px] text-[#4b4b4b] mb-6 max-w-sm">{message}</p>

      {steps && steps.length > 0 && (
        <div className="mb-6 text-left w-full max-w-sm">
          <p className="text-[14px] font-semibold text-[#262626] mb-3">
            이용 방법:
          </p>
          <ol className="space-y-2">
            {steps.map((step) => (
              <li
                key={step.step}
                className="flex gap-3 text-[14px] text-[#4b4b4b]"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#d03e1b] text-white text-xs font-semibold flex-shrink-0">
                  {step.step}
                </span>
                <span>{step.description}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {ctaLabel && ctaOnClick && (
        <button
          onClick={ctaOnClick}
          className="px-4 py-2 bg-[#d03e1b] text-white rounded-[8px] font-semibold hover:bg-[#b23417] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
