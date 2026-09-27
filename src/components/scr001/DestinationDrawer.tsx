"use client";

import { useState } from "react";
import Image from "next/image";
import { destinations, type Destination } from "@/data/destinations";
import { safetyInfo } from "@/data/safety";
import { Button } from "@/components/shared/Button";
import { DialogBase } from "@/components/shared/DialogBase";

interface DestinationDrawerProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DestinationDrawer({
  destination,
  isOpen,
  onClose,
}: DestinationDrawerProps) {
  const [showingSafety, setShowingSafety] = useState(false);

  if (!destination) return null;

  const isInternational = destination.region === "international";
  const countrySafetyInfo = isInternational
    ? safetyInfo.find((s) => s.country === destination.country)
    : null;

  // Get recommendations (max 6): same country or domestic if destination is domestic
  const recommendations = destinations
    .filter((d) => {
      if (d.id === destination.id) return false;
      if (isInternational) {
        return d.country === destination.country;
      } else {
        return d.region === "domestic";
      }
    })
    .slice(0, 6);

  const highlights = [
    "현지 특색 있는 음식 문화",
    "대표 관광지와 명소",
    "전통과 현대의 조화",
  ];

  const itinerary = [
    "첫 날: 도착 및 숙소 정착",
    "중간: 주요 관광지 탐방",
    "마지막: 현지 시장 및 기념품 구매",
  ];

  return (
    <DialogBase
      isOpen={isOpen && !showingSafety}
      onClose={onClose}
      title={showingSafety ? "안전정보" : destination.name}
      className="w-full max-w-md"
    >
      {!showingSafety ? (
        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={destination.imageUrl}
              alt={destination.name}
              fill
              className="object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                {destination.country}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {destination.name}
              </h2>
            </div>

            {/* Overview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">개요</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">주요 특징</h3>
              <ul className="mt-2 space-y-2">
                {highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-coral" />
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                추천 일정(예시)
              </h3>
              <ol className="mt-2 space-y-2">
                {itinerary.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700 pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Safety Info Button */}
            {isInternational && countrySafetyInfo && (
              <Button
                onClick={() => setShowingSafety(true)}
                variant="secondary"
                className="w-full text-sm"
              >
                안전정보 보기 →
              </Button>
            )}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                관련 여행지
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="overflow-hidden rounded-lg border border-gray-200 hover:shadow-card transition-shadow"
                  >
                    <div className="relative h-24 w-full bg-gray-100">
                      <Image
                        src={rec.imageUrl}
                        alt={rec.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='160'%3E%3Crect fill='%23e5e7eb' width='200' height='160'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {rec.name}
                      </p>
                      <p className="text-xs text-gray-600">{rec.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Safety Info View
        <div className="space-y-6">
          {countrySafetyInfo ? (
            <>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  {destination.country}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  안전정보
                </h2>
              </div>

              {countrySafetyInfo.categories.map((category: { name: string; status: string; details: string }) => (
                <div key={category.name}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          category.status === "safe"
                            ? "#10b981"
                            : category.status === "caution"
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    />
                    <h3 className="text-sm font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {category.details}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600">
                안전정보가 준비되지 않았습니다.
              </p>
            </div>
          )}

          <Button
            onClick={() => setShowingSafety(false)}
            variant="secondary"
            className="w-full text-sm"
          >
            ← 돌아가기
          </Button>
        </div>
      )}
    </DialogBase>
  );
}
