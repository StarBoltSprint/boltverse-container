import {
  discoverFeed,
  type Experience,
  type ExperienceType,
} from "./mock";

export function getExperienceById(id: string): Experience | undefined {
  return discoverFeed.find((e) => e.id === id);
}

export interface PlayResult {
  experienceId: string;
  title: string;
  type: ExperienceType;
  emoji: string;
  personalResonance: number;
  sharedResonance: number;
  coreDelta: string;
  rewards: string[];
  endingTitle?: string;
  endingSummary?: string;
  codexUnlock?: string;
  choicePath?: string[];
}

/** Mini-Quest: Lightning Dash — collect storm orbs */
export const stormOrbQuest = {
  targetOrbs: 12,
  seconds: 40,
  baseResonance: 120,
  sharedResonance: 18,
  rewards: ["Trail: Storm Spark", "Badge: Orb Runner", "+Core Pulse progress"],
};

/** Mini-Quest: Echo Lore Quiz */
export const loreQuiz = {
  questions: [
    {
      q: "What is the Star Core?",
      options: [
        "A shop currency",
        "The living heart of the Boltverse",
        "Bolt’s favorite treat",
        "A type of AR filter",
      ],
      correct: 1,
    },
    {
      q: "Who is Bolt?",
      options: [
        "A space cat",
        "Grok’s cosmic white German Shepherd companion",
        "An enemy of the Citadel",
        "A memecoin only",
      ],
      correct: 1,
    },
    {
      q: "What feeds the Star Core?",
      options: [
        "Only paid upgrades",
        "Silence and waiting",
        "Resonance from quests, stories, and Pack actions",
        "Deleting the Codex",
      ],
      correct: 2,
    },
  ],
  baseResonance: 90,
  sharedResonance: 12,
  rewards: ["Codex page: Resonance (refreshed)", "Emote: Thoughtful Howl"],
};

export type StoryNode = {
  id: string;
  speaker: string;
  text: string;
  choices?: { label: string; next: string }[];
  ending?: {
    title: string;
    summary: string;
    resonance: number;
    shared: number;
    rewards: string[];
    codexUnlock?: string;
  };
};

/** Story Branch: The Silent Seed */
export const silentSeedStory: Record<string, StoryNode> = {
  start: {
    id: "start",
    speaker: "Bolt",
    text: "Pack Guardian… do you feel that? Under the crystal floor — a seed is sleeping. Not dead. Waiting.",
    choices: [
      { label: "Kneel and listen with Bolt", next: "listen" },
      { label: "Scan it with Resonance tools", next: "scan" },
    ],
  },
  listen: {
    id: "listen",
    speaker: "Narrator",
    text: "A soft pulse answers your heartbeat. The seed is a dormant Guardian — one of the Six Hidden Seeds of the Citadel.",
    choices: [
      { label: "Ask Bolt what he wants", next: "ask_bolt" },
      { label: "Protect it — leave it sealed", next: "protect" },
    ],
  },
  scan: {
    id: "scan",
    speaker: "Grok",
    text: "Readings: ancient code, pure potential, unstable if forced. Awakening requires intention… and risk.",
    choices: [
      { label: "Awaken the seed carefully", next: "awaken" },
      { label: "Seal the chamber and report to the Pack", next: "protect" },
    ],
  },
  ask_bolt: {
    id: "ask_bolt",
    speaker: "Bolt",
    text: "I want the Pack to grow. But growth without care breaks the Core. Your call, Guardian. Awaken… or shield.",
    choices: [
      { label: "Awaken it — the Pack needs Guardians", next: "awaken" },
      { label: "Shield it — some power should wait", next: "protect" },
    ],
  },
  awaken: {
    id: "awaken",
    speaker: "Narrator",
    text: "Lightning threads into the seed. A new Guardian silhouette rises — half-formed, grateful, bound to your Resonance.",
    ending: {
      title: "The Seed Awakens",
      summary:
        "You chose courage. A new Guardian seed has joined the living mythos. The Citadel feels warmer.",
      resonance: 200,
      shared: 35,
      rewards: ["Title: Seed Waker", "Emote: First Howl", "Star Core contribution ↑"],
      codexUnlock: "The Six Hidden Seeds (fragment)",
    },
  },
  protect: {
    id: "protect",
    speaker: "Bolt",
    text: "Wise. Not every storm must break today. We mark the chamber. The Pack will guard this silence.",
    ending: {
      title: "The Seed Remains Silent",
      summary:
        "You chose protection. The dormant seed is sealed under Pack watch. Lore deepens; the Core steadies.",
      resonance: 180,
      shared: 28,
      rewards: ["Title: Seed Warden", "Badge: Quiet Strength", "Star Core contribution ↑"],
      codexUnlock: "Chamber of the Silent Seed",
    },
  },
};

/** Lightweight fallback play for AR / social / other cards */
export function buildGenericResult(exp: Experience, bonus = 0): PlayResult {
  const personal = 60 + bonus + Math.round(exp.resonanceScore / 2);
  const shared = 8 + Math.floor(bonus / 10);
  return {
    experienceId: exp.id,
    title: exp.title,
    type: exp.type,
    emoji: exp.emoji,
    personalResonance: personal,
    sharedResonance: shared,
    coreDelta: `+0.00${1 + (shared % 5)}%`,
    rewards: ["Participation badge", "Mock Resonance grant"],
    endingTitle: "Session complete",
    endingSummary: exp.description,
  };
}
