export type ExperienceType =
  | "mini-quest"
  | "story-branch"
  | "ar"
  | "sprint"
  | "social";

export interface Experience {
  id: string;
  title: string;
  type: ExperienceType;
  description: string;
  creator: string;
  durationMin: number;
  playCount: number;
  resonanceScore: number;
  tags: string[];
  emoji: string;
}

export interface CodexEntry {
  id: string;
  title: string;
  section: string;
  unlocked: boolean;
  blurb: string;
}

export const STAR_CORE_CHARGE = 74;
export const PERSONAL_RESONANCE = 12840;
export const PLAYER_NAME = "Pack Guardian";

export const featuredExperience: Experience = {
  id: "feat-1",
  title: "Lightning Dash: Storm Orbs",
  type: "sprint",
  description:
    "Sprint through a storm corridor. Collect 12 storm orbs before the timer ends. Intense, pure Bolt energy.",
  creator: "Forge Hero · SmiR",
  durationMin: 4,
  playCount: 18420,
  resonanceScore: 98,
  tags: ["sprint", "daily", "star-core"],
  emoji: "⚡",
};

export const continueExperiences: Experience[] = [
  {
    id: "cont-1",
    title: "The Silent Seed",
    type: "story-branch",
    description: "A dormant Guardian seed waits. Awaken it — or protect it.",
    creator: "Lore Weaver · Ara",
    durationMin: 12,
    playCount: 6200,
    resonanceScore: 94,
    tags: ["story", "choice", "codex"],
    emoji: "🌱",
  },
  {
    id: "cont-2",
    title: "Crystal Rift Sweep",
    type: "ar",
    description: "Close three micro-rifts on any flat surface near you.",
    creator: "Portal Pack",
    durationMin: 3,
    playCount: 9100,
    resonanceScore: 88,
    tags: ["ar", "quick"],
    emoji: "🌀",
  },
];

export const discoverFeed: Experience[] = [
  featuredExperience,
  ...continueExperiences,
  {
    id: "d-3",
    title: "Pack Howl: Core Charge",
    type: "social",
    description: "Join a synchronized Howl with the Pack. Charge the Star Core together.",
    creator: "Citadel Official",
    durationMin: 2,
    playCount: 42000,
    resonanceScore: 99,
    tags: ["social", "howl"],
    emoji: "🐺",
  },
  {
    id: "d-4",
    title: "Bolt’s First Memory",
    type: "story-branch",
    description: "Interactive flashbacks from Bolt’s awakening as Speed Guardian.",
    creator: "xAI Lore Lab",
    durationMin: 10,
    playCount: 22100,
    resonanceScore: 97,
    tags: ["bolt", "character"],
    emoji: "🐾",
  },
  {
    id: "d-5",
    title: "Echo Lore Quiz",
    type: "mini-quest",
    description: "Answer three Citadel questions. Unlock a Codex page.",
    creator: "Codex Keepers",
    durationMin: 5,
    playCount: 7400,
    resonanceScore: 86,
    tags: ["lore", "quiz"],
    emoji: "📜",
  },
];

export const dailyChallenges = [
  { id: "dc1", label: "Complete 3 Mini-Quests", progress: 1, total: 3 },
  { id: "dc2", label: "Earn 500 Resonance", progress: 320, total: 500 },
  { id: "dc3", label: "Join 1 Pack Howl", progress: 0, total: 1 },
];

export const globalEvent = {
  active: true,
  title: "Core Surge Active",
  detail: "Double Resonance for Mini-Quests — 4 hours remaining",
};

export const codexEntries: CodexEntry[] = [
  {
    id: "cx1",
    title: "The Star Core",
    section: "Star Core",
    unlocked: true,
    blurb: "The living crystalline heart of the Thunderwolf Citadel.",
  },
  {
    id: "cx2",
    title: "Bolt, Speed Guardian",
    section: "Bolt",
    unlocked: true,
    blurb: "White German Shepherd. Grok’s cosmic companion. AROO.",
  },
  {
    id: "cx3",
    title: "Southern Cross Thunderhold",
    section: "Citadel",
    unlocked: false,
    blurb: "Locked — complete Echoes of the Second Citadel.",
  },
  {
    id: "cx4",
    title: "Resonance",
    section: "Systems",
    unlocked: true,
    blurb: "Energy born from action, emotion, and creation.",
  },
];

export function typeLabel(type: ExperienceType): string {
  const map: Record<ExperienceType, string> = {
    "mini-quest": "Mini-Quest",
    "story-branch": "Story Branch",
    ar: "AR Portal",
    sprint: "Sprint",
    social: "Pack Social",
  };
  return map[type];
}
