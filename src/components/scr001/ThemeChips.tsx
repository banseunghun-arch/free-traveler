"use client";

import { useState, useCallback } from "react";

const THEMES = [
  { id: "adventure", label: "모험" },
  { id: "culture", label: "문화" },
  { id: "relaxation", label: "휴식" },
  { id: "food", label: "음식" },
  { id: "nature", label: "자연" },
  { id: "city", label: "도시" },
];

interface ThemeChipsProps {
  onThemeChange?: (selectedThemes: string[]) => void;
}

export function ThemeChips({ onThemeChange }: ThemeChipsProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = useCallback(
    (themeId: string) => {
      const newSelected = selected.includes(themeId)
        ? selected.filter((id) => id !== themeId)
        : [...selected, themeId];
      setSelected(newSelected);
      onThemeChange?.(newSelected);
    },
    [selected, onThemeChange]
  );

  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          여행 동기 · 테마
        </h2>
        <p className="mt-2 text-gray-600">관심 있는 여행지의 특징을 선택하세요</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleToggle(theme.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selected.includes(theme.id)
                  ? "bg-coral text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
