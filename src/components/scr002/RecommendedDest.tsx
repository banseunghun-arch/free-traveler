"use client";

import { destinations } from "@/data/destinations";

const RECOMMENDED_IDS = [
  "tokyo",
  "paris",
  "sydney",
  "bangkok",
  "rome",
  "newyork",
];

export function RecommendedDest() {
  const recommended = destinations.filter((d) => RECOMMENDED_IDS.includes(d.id));

  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          추천 여행지
        </h2>
        <p className="mt-2 text-gray-600">
          실제로 다녀본 곳 중 꼭 추천하고 싶은 여행지들
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommended.map((dest) => (
            <div
              key={dest.id}
              className="p-6 rounded-lg border border-gray-200 hover:shadow-card transition-shadow"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                {dest.country}
              </p>
              <h3 className="mt-2 text-xl font-bold text-gray-900">
                {dest.name}
              </h3>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                {dest.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {dest.region === "domestic" ? "국내" : "해외"} 여행지
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
