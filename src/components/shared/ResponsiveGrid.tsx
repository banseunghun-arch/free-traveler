import Image from "next/image";
import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ResponsiveGrid({
  children,
  className = "",
  cols = { mobile: 1, tablet: 2, desktop: 3 },
}: ResponsiveGridProps) {
  const gridClass = `grid gap-4 md:gap-6 grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;

  return <div className={`${gridClass} ${className}`}>{children}</div>;
}

interface ImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  width: number;
  height: number;
  className?: string;
}

export function ResponsiveImage({
  src,
  alt,
  priority = false,
  width,
  height,
  className = "",
}: ImageProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="w-full h-auto object-cover"
      />
    </div>
  );
}
