"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/shared/Button";

interface SearchFilters {
  keyword: string;
  season?: string;
  startDate?: string;
  endDate?: string;
}

interface SearchHeroProps {
  onSearch?: (results: typeof destinations) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [keyword, setKeyword] = useState("");
  const [season, setSeason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = useCallback(() => {
    const filtered = destinations.filter((dest) => {
      // Keyword match (partial, case-insensitive)
      const keywordMatch =
        !keyword ||
        dest.name.toLowerCase().includes(keyword.toLowerCase()) ||
        dest.country.toLowerCase().includes(keyword.toLowerCase()) ||
        dest.description.toLowerCase().includes(keyword.toLowerCase());

      return keywordMatch;
    });

    onSearch?.(filtered);
  }, [keyword, onSearch]);

  const handleReset = useCallback(() => {
    setKeyword("");
    setSeason("");
    setStartDate("");
    setEndDate("");
    onSearch?.(destinations);
  }, [onSearch]);

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="space-y-8">
          {/* Hero Heading */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              당신의 다음 여행을 찾아보세요
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              전 세계 여행지를 검색하고 안전정보를 확인하세요
            </p>
          </div>

          {/* Search Form */}
          <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {/* Keyword Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                여행지 또는 국가
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="파리, 도쿄, 제주도..."
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
              />
            </div>

            {/* Season Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-900">
                선호 계절 (선택)
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
              >
                <option value="">모든 계절</option>
                <option value="spring">봄</option>
                <option value="summer">여름</option>
                <option value="fall">가을</option>
                <option value="winter">겨울</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  출발일 (선택)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  복귀일 (선택)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 md:flex-row">
              <Button
                onClick={handleSearch}
                className="flex-1"
              >
                검색하기
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="flex-1"
              >
                초기화
              </Button>
              <Link
                href="/travel-tools"
                className="flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-200 transition-colors flex-1"
              >
                여행 조건 정리하기 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
