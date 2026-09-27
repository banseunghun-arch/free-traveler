"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-[32px] font-bold text-[#262626] mb-4">
        문제가 발생했습니다
      </h1>
      <h2 className="text-[18px] font-semibold text-[#262626] mb-2">500</h2>
      <p className="text-[16px] text-[#4b4b4b] mb-2 max-w-sm">
        일시적인 오류가 발생했습니다.
      </p>
      {process.env.NODE_ENV === "development" && (
        <p className="text-[12px] text-[#d7263d] mb-8 max-w-sm break-all">
          {error.message}
        </p>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 bg-[#d03e1b] text-white rounded-[8px] font-semibold hover:bg-[#b23417] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
      >
        다시 시도
      </button>
    </div>
  );
}
