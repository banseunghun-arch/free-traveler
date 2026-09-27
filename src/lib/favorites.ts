// Browser localStorage-based favorites (no server sync)
const FAVORITES_KEY = "traveler_favorites";

function getFavoritesFromStorage(): string[] {
  try {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavoritesToStorage(favorites: string[]): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Silently fail in SSR or quota exceeded
  }
}

export function addFavorite(slug: string): boolean {
  const favorites = getFavoritesFromStorage();
  if (!favorites.includes(slug)) {
    favorites.push(slug);
    saveFavoritesToStorage(favorites);
    return true;
  }
  return false;
}

export function removeFavorite(slug: string): boolean {
  const favorites = getFavoritesFromStorage();
  const index = favorites.indexOf(slug);
  if (index >= 0) {
    favorites.splice(index, 1);
    saveFavoritesToStorage(favorites);
    return true;
  }
  return false;
}

export function isFavorite(slug: string): boolean {
  const favorites = getFavoritesFromStorage();
  return favorites.includes(slug);
}

export function getFavorites(): string[] {
  return getFavoritesFromStorage();
}

export function toggleFavorite(slug: string): boolean {
  if (isFavorite(slug)) {
    removeFavorite(slug);
    return false;
  } else {
    addFavorite(slug);
    return true;
  }
}
