"use client";

import Link from "next/link";
import { representative } from "@/data/representative";

/**
 * SCR-001 Section 7: About Summary Block
 * Left-right split layout showing representative profile stats and intro
 */
export function AboutSummaryBlock() {
  const { name, title, bio, stats } = representative;

  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center">
          {/* Left: Stats */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {title}
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                {name}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-4xl md:text-5xl font-bold text-coral">
                  {stats.trips}+
                </p>
                <p className="mt-1 text-sm text-gray-600">Trips</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-coral">
                  {stats.countries}+
                </p>
                <p className="mt-1 text-sm text-gray-600">Countries</p>
              </div>
              <div>
                <p className="text-4xl md:text-5xl font-bold text-coral">
                  {stats.years}+
                </p>
                <p className="mt-1 text-sm text-gray-600">Years</p>
              </div>
            </div>
          </div>

          {/* Right: Bio and CTA */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">{bio}</p>

            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 bg-coral text-white font-semibold rounded-lg hover:bg-coral-dark transition-colors"
            >
              대표 이야기 더 보기
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
