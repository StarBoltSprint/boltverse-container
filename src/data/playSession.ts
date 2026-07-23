import type { PlayResult } from "./playContent";

const KEY = "boltverse-last-result";

export function savePlayResult(result: PlayResult): void {
  sessionStorage.setItem(KEY, JSON.stringify(result));
}

export function loadPlayResult(experienceId?: string): PlayResult | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayResult;
    if (experienceId && parsed.experienceId !== experienceId) return null;
    return parsed;
  } catch {
    return null;
  }
}
