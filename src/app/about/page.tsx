import type { Metadata } from "next";
import { ProfileHero } from "@/components/scr002/ProfileHero";
import { TravelStats } from "@/components/scr002/TravelStats";
import { IntroPhilosophy } from "@/components/scr002/IntroPhilosophy";
import { Timeline } from "@/components/scr002/Timeline";
import { VisitedCountries } from "@/components/scr002/VisitedCountries";
import { PhotoGallery } from "@/components/scr002/PhotoGallery";
import { RecommendedDest } from "@/components/scr002/RecommendedDest";

export const metadata: Metadata = {
  title: "About Free Traveler",
  description:
    "Free Traveler의 이야기와 비전. 여행자들을 연결하고 경험을 나누는 플랫폼입니다.",
  openGraph: {
    title: "About Free Traveler",
    description:
      "Free Traveler의 이야기와 비전. 여행자들을 연결하고 경험을 나누는 플랫폼입니다.",
  },
};

export default function AboutPage() {
  return (
    <main className="w-full">
      {/* Section 1: Hero Profile */}
      <ProfileHero />

      {/* Section 2: Travel Stats */}
      <TravelStats />

      {/* Section 3: Intro & Philosophy */}
      <IntroPhilosophy />

      {/* Section 4: Timeline */}
      <Timeline />

      {/* Section 5: Visited Countries */}
      <VisitedCountries />

      {/* Section 6: Photo Gallery */}
      <PhotoGallery />

      {/* Section 7: Recommended Destinations */}
      <RecommendedDest />
    </main>
  );
}
