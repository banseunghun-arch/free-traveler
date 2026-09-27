"use client";

import { representative } from "@/data/representative";

export function ProfileHero() {
  return (
    <section className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-20 md:py-32 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          {/* Left: Image placeholder */}
          <div className="h-96 md:h-full rounded-lg bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400">대표 프로필 사진</p>
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold">
                {representative.name}
              </h1>
              <p className="mt-2 text-xl text-gray-300">
                {representative.title}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-300">{representative.bio}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <p className="text-3xl font-bold text-coral">
                    {representative.stats.trips}+
                  </p>
                  <p className="text-gray-400">Trips</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-coral">
                    {representative.stats.countries}+
                  </p>
                  <p className="text-gray-400">Countries</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-coral">
                    {representative.stats.years}+
                  </p>
                  <p className="text-gray-400">Years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
