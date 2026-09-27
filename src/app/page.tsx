import type { Metadata } from "next";
import { SearchHero } from "@/components/scr001/SearchHero";
import { DestinationGrid } from "@/components/scr001/DestinationGrid";
import { ThemeChips } from "@/components/scr001/ThemeChips";
import { SafetyGrid } from "@/components/scr001/SafetyGrid";
import { MatePreview } from "@/components/scr001/MatePreview";
import { AboutSummaryBlock } from "@/components/scr001/AboutSummaryBlock";

export const metadata: Metadata = {
  title: "Free Traveler - 여행 도구와 동행 찾기",
  description:
    "무료 여행 플랫폼. 여행지 추천, 항공·숙소 검색 도구, 동행자 찾기를 한 곳에서 경험하세요.",
  openGraph: {
    title: "Free Traveler",
    description:
      "무료 여행 플랫폼. 여행지 추천, 항공·숙소 검색 도구, 동행자 찾기를 한 곳에서.",
  },
};

export default function HomePage() {
  return (
    <main className="w-full">
      {/* Section 1: Search Hero */}
      <SearchHero />

      {/* Section 2: Domestic Destinations */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            국내 인기 여행지
          </h2>
          <p className="mt-2 text-gray-600">
            한국의 가장 매력적인 여행지들을 만나보세요
          </p>
          <div className="mt-8">
            <DestinationGrid variant="domestic" limit={6} />
          </div>
        </div>
      </section>

      {/* Section 3: International Destinations */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            해외 인기 여행지
          </h2>
          <p className="mt-2 text-gray-600">
            세계의 다양한 목적지를 탐험해보세요
          </p>
          <div className="mt-8">
            <DestinationGrid variant="international" limit={6} />
          </div>
        </div>
      </section>

      {/* Section 4: Travel Themes */}
      <section className="w-full bg-white">
        <ThemeChips />
      </section>

      {/* Section 5: Safety Info */}
      <section className="w-full bg-gray-50">
        <SafetyGrid limit={6} />
      </section>

      {/* Section 6: Recent Mate Posts */}
      <section className="w-full bg-white">
        <MatePreview />
      </section>

      {/* Section 7: About Summary */}
      <section className="w-full bg-gray-50">
        <AboutSummaryBlock />
      </section>
    </main>
  );
}
