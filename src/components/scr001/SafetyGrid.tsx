"use client";

import { safetyInfo } from "@/data/safety";

interface SafetyGridProps {
  limit?: number;
}

export function SafetyGrid({ limit = 6 }: SafetyGridProps) {
  const displayed = safetyInfo.slice(0, limit);

  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          국가별 주의사항
        </h2>
        <p className="mt-2 text-gray-600">여행 전 안전정보를 확인하세요</p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((country) => {
            const levelColor = {
              safe: "bg-green-50 border-green-200",
              caution: "bg-yellow-50 border-yellow-200",
              warning: "bg-red-50 border-red-200",
            }[country.level];

            return (
              <div
                key={country.country}
                className={`rounded-lg border p-6 ${levelColor}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {country.country}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {country.region}
                    </p>
                  </div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      country.level === "safe"
                        ? "bg-green-100 text-green-800"
                        : country.level === "caution"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {country.level === "safe"
                      ? "안전"
                      : country.level === "caution"
                        ? "주의"
                        : "경고"}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {country.categories.slice(0, 2).map((cat) => (
                    <div key={cat.name} className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-700 line-clamp-2">
                        {cat.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
