"use client";

const COUNTRIES_BY_REGION = {
  아시아: [
    "대한민국",
    "일본",
    "태국",
    "베트남",
    "캄보디아",
    "인도네시아",
    "필리핀",
    "싱가포르",
  ],
  유럽: [
    "프랑스",
    "영국",
    "스페인",
    "이탈리아",
    "독일",
    "네덜란드",
    "스위스",
    "오스트리아",
  ],
  아메리카: [
    "미국",
    "캐나다",
    "멕시코",
    "브라질",
    "아르헨티나",
    "칠레",
    "페루",
  ],
  아프리카: [
    "이집트",
    "케냐",
    "탄자니아",
    "남아프리카공화국",
    "모로코",
  ],
  오세아니아: ["호주", "뉴질랜드"],
};

export function VisitedCountries() {
  return (
    <section className="w-full py-12 md:py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          방문한 국가
        </h2>
        <p className="mt-2 text-gray-600">총 30개국 이상을 방문했습니다</p>

        <div className="mt-12 space-y-8">
          {Object.entries(COUNTRIES_BY_REGION).map(([region, countries]) => (
            <div key={region}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {region}
              </h3>
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <span
                    key={country}
                    className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-900 text-sm font-medium hover:border-coral hover:text-coral transition-colors"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
