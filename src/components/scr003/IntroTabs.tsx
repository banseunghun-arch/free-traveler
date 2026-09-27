"use client";

import { useState, ReactNode } from "react";

interface IntroTabsProps {
  flightContent: ReactNode;
  hotelContent: ReactNode;
  mateContent: ReactNode;
}

export function IntroTabs({
  flightContent,
  hotelContent,
  mateContent,
}: IntroTabsProps) {
  const [activeTab, setActiveTab] = useState<"flight" | "hotel" | "mate">(
    "flight"
  );

  const tabs = [
    { id: "flight" as const, label: "항공편 찾기" },
    { id: "hotel" as const, label: "숙소 찾기" },
    { id: "mate" as const, label: "동행 구하기" },
  ];

  const tabContents = {
    flight: flightContent,
    hotel: hotelContent,
    mate: mateContent,
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-8">
          {/* Intro Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                여행 조건을 정리하고 동행을 찾으세요
              </h2>
              <p className="mt-3 text-base md:text-lg text-gray-600">
                Free Traveler는 항공편과 숙소 정보를 제공하지 않습니다.
                외부 사이트로 안내하며, 여행 계획 정보는 저장하지 않습니다.
              </p>
            </div>

            {/* 3-Step Usage Order */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-coral text-white font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">여행 조건 입력</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    국가, 지역, 여행 일정을 선택하세요
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-coral text-white font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    항공편·숙소 검색
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    외부 사이트에서 최저가를 비교하세요
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-coral text-white font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">동행글 등록</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    비슷한 일정의 여행자를 찾고 함께 떠나세요
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8 md:gap-12">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 text-base font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "text-coral"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                  {/* Underline for active tab */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-coral" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {tabContents[activeTab]}
          </div>
        </div>
      </div>
    </section>
  );
}
