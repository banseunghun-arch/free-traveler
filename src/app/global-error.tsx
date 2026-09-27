"use client";

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h1 className="text-[32px] font-bold text-[#262626] mb-4">
            예상치 못한 오류
          </h1>
          <p className="text-[16px] text-[#4b4b4b] mb-8 max-w-sm">
            시스템에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="mb-8 text-[12px] text-[#d7263d] max-w-sm overflow-auto bg-[#fff4e0] p-4 rounded">
              {error.message}
            </pre>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#d03e1b] text-white rounded-[8px] font-semibold hover:bg-[#b23417] transition-colors"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
