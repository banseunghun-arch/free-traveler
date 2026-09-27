"use client";

import Link from "next/link";
import { Button } from "@/components/shared/Button";

const SAMPLE_POSTS = [
  {
    id: "1",
    title: "Seoul City Tour",
    country: "대한민국",
    dates: "2026-10-15 ~ 2026-10-20",
    recruitment: "2명",
    status: "모집중",
  },
  {
    id: "2",
    title: "Jeju Island Hiking",
    country: "대한민국",
    dates: "2026-11-01 ~ 2026-11-05",
    recruitment: "3명",
    status: "모집중",
  },
  {
    id: "3",
    title: "Japan Trip - Kyoto Focus",
    country: "일본",
    dates: "2026-12-10 ~ 2026-12-25",
    recruitment: "4명",
    status: "모집중",
  },
];

export function MatePreview() {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              최근 동행글
            </h2>
            <p className="mt-2 text-gray-600">함께 떠날 동행자를 찾아보세요</p>
          </div>
          <Link href="/mates" className="hidden md:block">
            <Button variant="secondary">더 보기 →</Button>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {SAMPLE_POSTS.map((post) => (
            <div
              key={post.id}
              className="overflow-hidden rounded-lg border border-gray-200 hover:shadow-card transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {post.country}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 flex-shrink-0">
                    {post.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>📅 {post.dates}</p>
                  <p>👥 {post.recruitment}</p>
                </div>

                <Link href="/mates" className="mt-4 block md:hidden">
                  <Button variant="secondary" className="w-full text-sm">
                    상세보기 →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <Link href="/mates" className="mt-8 block md:hidden text-center">
          <Button>전체 동행글 보기</Button>
        </Link>
      </div>
    </section>
  );
}
