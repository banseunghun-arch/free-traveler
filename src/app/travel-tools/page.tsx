import type { Metadata } from "next";
import { IntroTabs } from "@/components/scr003/IntroTabs";
import { FlightForm } from "@/components/scr003/FlightForm";
import { HotelForm } from "@/components/scr003/HotelForm";
import { MateComposer } from "@/components/scr003/MateComposer";

export const metadata: Metadata = {
  title: "Travel Tools - 여행 도구",
  description:
    "항공편, 숙소, 동행자를 한 곳에서 찾으세요. Free Traveler의 여행 도구.",
  openGraph: {
    title: "Travel Tools",
    description:
      "항공편, 숙소, 동행자를 한 곳에서 찾으세요. Free Traveler의 여행 도구.",
  },
};

export default function TravelTools() {
  return (
    <main className="min-h-screen bg-white">
      <IntroTabs
        flightContent={<FlightForm />}
        hotelContent={<HotelForm />}
        mateContent={<MateComposer />}
      />
    </main>
  );
}
