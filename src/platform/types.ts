export type Platform = "desktop" | "android" | "ios";

export const PLATFORM_STORAGE_KEY = "boltverse-platform";

export const PLATFORMS: {
  id: Platform;
  label: string;
  short: string;
  icon: string;
  blurb: string;
}[] = [
  {
    id: "desktop",
    label: "Desktop",
    short: "Web / PC",
    icon: "🖥️",
    blurb: "Wide Citadel shell with side navigation — best on a large screen.",
  },
  {
    id: "android",
    label: "Android",
    short: "Phone UI",
    icon: "🤖",
    blurb: "Material-style mobile shell with bottom tabs — Grok app phone layout.",
  },
  {
    id: "ios",
    label: "iOS",
    short: "iPhone UI",
    icon: "🍎",
    blurb: "iOS-style mobile shell with bottom tabs and safe-area chrome.",
  },
];

export function isPlatform(value: string | null): value is Platform {
  return value === "desktop" || value === "android" || value === "ios";
}

export function loadPlatform(): Platform | null {
  try {
    const raw = localStorage.getItem(PLATFORM_STORAGE_KEY);
    return isPlatform(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function savePlatform(platform: Platform): void {
  localStorage.setItem(PLATFORM_STORAGE_KEY, platform);
}

export function clearPlatform(): void {
  localStorage.removeItem(PLATFORM_STORAGE_KEY);
}
