"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { destinations, type Destination } from "@/data/destinations";
import {
  isFavorite,
  toggleFavorite as toggleFav,
  getFavorites,
} from "@/lib/favorites";
import { DestinationDrawer } from "./DestinationDrawer";
import { EmptyState } from "@/components/shared/EmptyState";

interface DestinationGridProps {
  variant: "domestic" | "international";
  limit?: number;
}

export function DestinationGrid({
  variant,
  limit = 6,
}: DestinationGridProps) {
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const filteredDestinations = destinations
    .filter((d) => {
      if (variant === "domestic") return d.region === "domestic";
      if (variant === "international") return d.region === "international";
      return false;
    })
    .slice(0, limit);

  const handleCardClick = useCallback((dest: Destination) => {
    setSelectedDestination(dest);
    setIsDrawerOpen(true);
  }, []);

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent, destId: string) => {
      e.stopPropagation();
      toggleFav(destId);
      setFavorites(getFavorites());
    },
    []
  );

  if (filteredDestinations.length === 0) {
    return (
      <EmptyState
        title="여행지 정보 준비 중"
        message="현재 표시할 여행지가 없습니다."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => handleCardClick(dest)}
            className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:shadow-card transition-shadow"
          >
            {/* Image Container */}
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
              <Image
                src={dest.imageUrl}
                alt={dest.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3C/svg%3E";
                }}
              />

              {/* Favorite Button */}
              <button
                onClick={(e) => handleFavoriteClick(e, dest.id)}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
                aria-label={`즐겨찾기 ${favorites.includes(dest.id) ? "제거" : "추가"}`}
              >
                <span
                  className="text-lg leading-none"
                  role="img"
                  aria-hidden
                >
                  {favorites.includes(dest.id) ? "❤️" : "🤍"}
                </span>
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                {dest.country}
              </p>
              <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-coral transition-colors">
                {dest.name}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {dest.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Destination Detail Drawer */}
      <DestinationDrawer
        destination={selectedDestination}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDestination(null);
        }}
      />
    </>
  );
}
