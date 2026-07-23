import type { Experience, ExperienceType } from "./mock";
import { discoverFeed as baseDiscoverFeed } from "./mock";

const PUBLISHED_KEY = "boltverse-published-v1";
const DRAFTS_KEY = "boltverse-drafts-v1";
const ONBOARDING_KEY = "boltverse-onboarding-done-v1";
const CODEX_KEY = "boltverse-codex-unlocks-v1";
const HOWL_KEY = "boltverse-howl-count-v1";
const DISPLAY_NAME_KEY = "boltverse-display-name-v1";

export type DraftExperience = {
  id: string;
  title: string;
  type: ExperienceType;
  description: string;
  emoji: string;
  durationMin: number;
  updatedAt: number;
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadPublished(): Experience[] {
  return readJson<Experience[]>(PUBLISHED_KEY, []);
}

export function savePublished(list: Experience[]): void {
  writeJson(PUBLISHED_KEY, list);
}

export function loadDrafts(): DraftExperience[] {
  return readJson<DraftExperience[]>(DRAFTS_KEY, []);
}

export function saveDrafts(list: DraftExperience[]): void {
  writeJson(DRAFTS_KEY, list);
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === "1";
}

export function setOnboardingDone(): void {
  localStorage.setItem(ONBOARDING_KEY, "1");
}

export function resetOnboarding(): void {
  localStorage.removeItem(ONBOARDING_KEY);
}

export function loadCodexUnlocks(): string[] {
  return readJson<string[]>(CODEX_KEY, []);
}

export function addCodexUnlock(id: string): void {
  const list = loadCodexUnlocks();
  if (!list.includes(id)) {
    writeJson(CODEX_KEY, [...list, id]);
  }
}

export function loadHowlCount(): number {
  return readJson<number>(HOWL_KEY, 0);
}

export function bumpHowlCount(): number {
  const n = loadHowlCount() + 1;
  writeJson(HOWL_KEY, n);
  return n;
}

export function loadDisplayName(): string {
  return localStorage.getItem(DISPLAY_NAME_KEY) || "Pack Guardian";
}

export function saveDisplayName(name: string): void {
  localStorage.setItem(DISPLAY_NAME_KEY, name.trim() || "Pack Guardian");
}

export function getFullDiscoverFeed(published: Experience[] = loadPublished()): Experience[] {
  // User publishes first so they see their work immediately
  const ids = new Set(published.map((p) => p.id));
  const base = baseDiscoverFeed.filter((b) => !ids.has(b.id));
  return [...published, ...base];
}

export function findExperience(
  id: string,
  published: Experience[] = loadPublished()
): Experience | undefined {
  return published.find((e) => e.id === id) ?? baseDiscoverFeed.find((e) => e.id === id);
}

export function draftToExperience(draft: DraftExperience, creator: string): Experience {
  return {
    id: draft.id,
    title: draft.title.trim() || "Untitled creation",
    type: draft.type,
    description: draft.description.trim() || "A Pack creation forged in the Citadel.",
    creator,
    durationMin: draft.durationMin || 5,
    playCount: 0,
    resonanceScore: 80,
    tags: ["community", "published", draft.type],
    emoji: draft.emoji || "✨",
  };
}

export function newDraftId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
