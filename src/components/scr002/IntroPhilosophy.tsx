"use client";

import { representative } from "@/data/representative";

export function IntroPhilosophy() {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          여행 철학
        </h2>

        <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
          {representative.bio.split("\n").map((para, idx) => (
            <p key={idx} className="text-lg">{para}</p>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">여행의 의미</h3>
            <p className="mt-4 text-gray-700">
              자유로운 여행은 단순한 관광을 넘어 다양한 문화를 경험하고
              새로운 관점을 발견하는 과정입니다.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">우리의 약속</h3>
            <p className="mt-4 text-gray-700">
              모든 여행자가 안전하고 의미 있는 경험을 할 수 있도록
              신뢰할 수 있는 정보와 도구를 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
