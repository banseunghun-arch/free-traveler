"use client";

const MILESTONES = [
  {
    year: "2011",
    title: "첫 여행",
    description: "동남아 배낭여행으로 자유로운 여행의 매력을 발견",
  },
  {
    year: "2014",
    title: "Europe Tour",
    description: "유럽 10개국 여행으로 문화 다양성 경험",
  },
  {
    year: "2017",
    title: "아프리카 대륙",
    description: "사하라 사막과 나일강을 따라 하는 모험",
  },
  {
    year: "2019",
    title: "오세아니아",
    description: "호주와 뉴질랜드에서 자연의 웅장함 체험",
  },
  {
    year: "2021",
    title: "아메리카",
    description: "북미에서 남미까지 2개 대륙 횡단",
  },
  {
    year: "2024",
    title: "Free Traveler 시작",
    description: "여행자의 경험을 나누고 지원하는 플랫폼 운영",
  },
];

export function Timeline() {
  return (
    <section className="w-full py-12 md:py-16 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          여행 스토리
        </h2>
        <p className="mt-2 text-gray-600">50여 년의 여행 경험을 담은 이야기</p>

        <div className="mt-12 space-y-8">
          {MILESTONES.map((milestone, idx) => (
            <div key={idx} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-coral text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                {idx < MILESTONES.length - 1 && (
                  <div className="w-1 h-20 bg-gray-200 mt-4" />
                )}
              </div>
              <div className="pt-2 pb-8">
                <p className="text-sm font-semibold text-coral">{milestone.year}</p>
                <h3 className="mt-1 text-lg font-bold text-gray-900">
                  {milestone.title}
                </h3>
                <p className="mt-2 text-gray-700">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
