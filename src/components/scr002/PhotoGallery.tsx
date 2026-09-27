"use client";

import Image from "next/image";

const GALLERY_IMAGES = [
  {
    id: "1",
    src: "/gallery/destination-1.jpg",
    alt: "서울의 밤거리 풍경",
    location: "Seoul",
  },
  {
    id: "2",
    src: "/gallery/destination-2.jpg",
    alt: "제주도 해안 절벽",
    location: "Jeju",
  },
  {
    id: "3",
    src: "/gallery/destination-3.jpg",
    alt: "일본 교토의 전통 사찰",
    location: "Kyoto",
  },
  {
    id: "4",
    src: "/gallery/destination-4.jpg",
    alt: "태국 방콕의 불야성",
    location: "Bangkok",
  },
  {
    id: "5",
    src: "/gallery/destination-5.jpg",
    alt: "유럽 파리의 에펠탑",
    location: "Paris",
  },
  {
    id: "6",
    src: "/gallery/destination-6.jpg",
    alt: "미국 뉴욕의 도시 스카이라인",
    location: "New York",
  },
  {
    id: "7",
    src: "/gallery/destination-7.jpg",
    alt: "호주 시드니의 오페라 하우스",
    location: "Sydney",
  },
  {
    id: "8",
    src: "/gallery/destination-8.jpg",
    alt: "캐나다 밴쿠버의 산과 바다",
    location: "Vancouver",
  },
];

export function PhotoGallery() {
  return (
    <div className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          여행 사진
        </h2>
        <p className="mt-2 text-gray-600">
          전 세계 곳곳에서 기록한 특별한 순간들
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {GALLERY_IMAGES.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg bg-gray-100"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3E" +
                      encodeURIComponent(image.alt) +
                      "%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* Location Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-sm font-semibold text-white">{image.location}</p>
                <p className="text-xs text-gray-200 line-clamp-2">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
