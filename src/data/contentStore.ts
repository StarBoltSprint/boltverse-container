import type { Experience, ExperienceType } from "./mock";
import { discoverFeed as baseDiscoverFeed } from "./mock";
import { listAccounts } from "../auth/registry";

const GLOBAL_PREFIX = "boltverse";

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

/** Scope user data so each registered account has its own save slot */
function userKey(userId: string | null | undefined, leaf: string): string {
  if (!userId) return `${GLOBAL_PREFIX}-anon-${leaf}`;
  return `${GLOBAL_PREFIX}-u-${userId}-${leaf}`;
}

// --- legacy global keys (migrate into first user when possible) ---
const LEGACY = {
  published: "boltverse-published-v1",
  drafts: "boltverse-drafts-v1",
  onboarding: "boltverse-onboarding-done-v1",
  codex: "boltverse-codex-unlocks-v1",
  howl: "boltverse-howl-count-v1",
  displayName: "boltverse-display-name-v1",
};

export function migrateLegacyContentToUser(userId: string): void {
  const pubKey = userKey(userId, "published-v2");
  if (localStorage.getItem(pubKey)) return; // already has user data

  const legacyPub = localStorage.getItem(LEGACY.published);
  if (legacyPub) localStorage.setItem(pubKey, legacyPub);

  const legacyDrafts = localStorage.getItem(LEGACY.drafts);
  if (legacyDrafts) localStorage.setItem(userKey(userId, "drafts-v2"), legacyDrafts);

  const legacyCodex = localStorage.getItem(LEGACY.codex);
  if (legacyCodex) localStorage.setItem(userKey(userId, "codex-v2"), legacyCodex);

  const legacyHowl = localStorage.getItem(LEGACY.howl);
  if (legacyHowl) localStorage.setItem(userKey(userId, "howl-v2"), legacyHowl);

  const legacyOn = localStorage.getItem(LEGACY.onboarding);
  if (legacyOn === "1") localStorage.setItem(userKey(userId, "onboarding-v2"), "1");

  const legacyName = localStorage.getItem(LEGACY.displayName);
  if (legacyName) localStorage.setItem(userKey(userId, "display-v2"), legacyName);
}

export function loadPublished(userId?: string | null): Experience[] {
  return readJson<Experience[]>(userKey(userId, "published-v2"), []);
}

export function savePublished(list: Experience[], userId?: string | null): void {
  writeJson(userKey(userId, "published-v2"), list);
}

export function loadDrafts(userId?: string | null): DraftExperience[] {
  return readJson<DraftExperience[]>(userKey(userId, "drafts-v2"), []);
}

export function saveDrafts(list: DraftExperience[], userId?: string | null): void {
  writeJson(userKey(userId, "drafts-v2"), list);
}

export function isOnboardingDone(userId?: string | null): boolean {
  if (userId) {
    return localStorage.getItem(userKey(userId, "onboarding-v2")) === "1";
  }
  // fallback legacy
  return localStorage.getItem(LEGACY.onboarding) === "1";
}

export function setOnboardingDone(userId?: string | null): void {
  if (userId) {
    localStorage.setItem(userKey(userId, "onboarding-v2"), "1");
  } else {
    localStorage.setItem(LEGACY.onboarding, "1");
  }
}

export function loadCodexUnlocks(userId?: string | null): string[] {
  return readJson<string[]>(userKey(userId, "codex-v2"), []);
}

export function saveCodexUnlocks(list: string[], userId?: string | null): void {
  writeJson(userKey(userId, "codex-v2"), list);
}

export function addCodexUnlock(id: string, userId?: string | null): void {
  const list = loadCodexUnlocks(userId);
  if (!list.includes(id)) {
    saveCodexUnlocks([...list, id], userId);
  }
}

export function loadHowlCount(userId?: string | null): number {
  return readJson<number>(userKey(userId, "howl-v2"), 0);
}

export function bumpHowlCount(userId?: string | null): number {
  const n = loadHowlCount(userId) + 1;
  writeJson(userKey(userId, "howl-v2"), n);
  return n;
}

export function loadDisplayName(userId?: string | null): string {
  if (userId) {
    const v = localStorage.getItem(userKey(userId, "display-v2"));
    if (v) return v;
  }
  return localStorage.getItem(LEGACY.displayName) || "Pack Guardian";
}

export function saveDisplayName(name: string, userId?: string | null): void {
  const v = name.trim() || "Pack Guardian";
  if (userId) localStorage.setItem(userKey(userId, "display-v2"), v);
  localStorage.setItem(LEGACY.displayName, v);
}

/** All community publishes from every registered account on this device */
export function loadAllCommunityPublished(): Experience[] {
  const all: Experience[] = [];
  const seen = new Set<string>();
  for (const acc of listAccounts()) {
    for (const exp of loadPublished(acc.id)) {
      if (!seen.has(exp.id)) {
        seen.add(exp.id);
        all.push(exp);
      }
    }
  }
  // also include anonymous legacy
  for (const exp of loadPublished(null)) {
    if (!seen.has(exp.id)) {
      seen.add(exp.id);
      all.push(exp);
    }
  }
  return all;
}

export function getFullDiscoverFeed(
  userPublished: Experience[] = [],
  community: Experience[] = loadAllCommunityPublished()
): Experience[] {
  const merged = [...userPublished];
  const ids = new Set(merged.map((p) => p.id));
  for (const c of community) {
    if (!ids.has(c.id)) {
      merged.push(c);
      ids.add(c.id);
    }
  }
  const base = baseDiscoverFeed.filter((b) => !ids.has(b.id));
  return [...merged, ...base];
}

export function findExperience(
  id: string,
  userPublished: Experience[] = []
): Experience | undefined {
  return (
    userPublished.find((e) => e.id === id) ??
    loadAllCommunityPublished().find((e) => e.id === id) ??
    baseDiscoverFeed.find((e) => e.id === id)
  );
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
