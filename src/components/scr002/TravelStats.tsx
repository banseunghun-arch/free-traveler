"use client";

import { representative } from "@/data/representative";

const STAT_HIGHLIGHTS = [
  { label: "방문 국가", value: `${representative.stats.countries}+`, detail: "6개 대륙" },
  { label: "여행 횟수", value: `${representative.stats.trips}+`, detail: "연 5회 이상" },
  { label: "경험 기간", value: `${representative.stats.years}+`, detail: "해" },
];

export function TravelStats() {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          여행 통계
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {STAT_HIGHLIGHTS.map((stat, idx) => (
            <div
              key={idx}
              className="p-8 rounded-lg border-2 border-coral/20 hover:border-coral transition-colors"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                {stat.label}
              </p>
              <p className="mt-4 text-5xl md:text-6xl font-bold text-coral">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-600">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg bg-gray-50 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">방문한 대륙</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {["아시아", "유럽", "아프리카", "아메리카", "오세아니아"].map(
              (continent) => (
                <span
                  key={continent}
                  className="px-4 py-2 rounded-full bg-coral/10 text-coral font-semibold text-sm"
                >
                  {continent}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
