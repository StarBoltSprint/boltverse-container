import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { usePlatform } from "../platform/PlatformContext";
import { isOnboardingDone, setOnboardingDone } from "../data/contentStore";
import { useContent } from "../content/ContentContext";

const STEPS = [
  {
    id: "welcome",
    emoji: "⚡🐺",
    title: "Welcome to the Citadel",
    body: "This is the Boltverse Official Container — a living Games Section where Mini-Quests, Story Branches, and the Pack charge one shared Star Core.",
  },
  {
    id: "bolt",
    emoji: "🐾",
    title: "Meet Bolt",
    body: "Bolt is Grok’s cosmic companion — a white German Shepherd of pure sprint and lightning. He walks with you through every howl, quest, and story.",
  },
  {
    id: "core",
    emoji: "💎",
    title: "The Star Core",
    body: "Every action generates Resonance. Part stays yours. Part flows into the shared Star Core — the heart of the Pack that everyone can see and strengthen together.",
  },
  {
    id: "play",
    emoji: "⚡📖",
    title: "Mini-Quests & Story Branches",
    body: "Mini-Quests are short daily sprints (2–8 min). Story Branches are deeper choice-driven lore (5–15 min). Both feed the Core and unlock Codex pages.",
  },
  {
    id: "create",
    emoji: "⚒️",
    title: "Create for the Pack",
    body: "Forge your own experiences, publish them, and watch them appear in Discover. Powered by xAI & YOU — the Pack writes the mythos together.",
  },
  {
    id: "name",
    emoji: "🏰",
    title: "Claim your Pack name",
    body: "This name shows on creations you publish. You can feel free to change the vibe later.",
  },
] as const;

export function Onboarding() {
  const { platform } = usePlatform();
  const { setDisplayName, displayName } = useContent();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(displayName === "Pack Guardian" ? "" : displayName);

  if (!platform) {
    return <Navigate to="/choose" replace />;
  }

  if (isOnboardingDone()) {
    return <Navigate to="/" replace />;
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isName = current.id === "name";

  function next() {
    if (isLast) {
      setDisplayName(name.trim() || "Pack Guardian");
      setOnboardingDone();
      navigate("/", { replace: true });
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    if (step === 0) {
      navigate("/choose", { replace: true });
      return;
    }
    setStep((s) => s - 1);
  }

  return (
    <div className="platform-gate onboarding-gate">
      <div className="platform-gate-bg" aria-hidden />
      <div className="platform-gate-card onboarding-card">
        <div className="onboarding-progress" aria-hidden>
          {STEPS.map((s, i) => (
            <i key={s.id} className={i <= step ? "on" : ""} />
          ))}
        </div>

        <div className="onboarding-emoji" aria-hidden>
          {current.emoji}
        </div>
        <h1 className="platform-gate-title">{current.title}</h1>
        <p className="platform-gate-sub">{current.body}</p>

        {isName && (
          <label className="onboarding-name">
            <span>Display name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thunder Pup"
              maxLength={24}
              autoFocus
            />
          </label>
        )}

        <div className="onboarding-actions">
          <button type="button" className="btn-ghost" onClick={back}>
            {step === 0 ? "Platform" : "Back"}
          </button>
          <button type="button" className="btn-play" onClick={next}>
            {isLast ? "Enter the Citadel" : "Continue"}
          </button>
        </div>

        <p className="platform-gate-foot">
          Step {step + 1} of {STEPS.length} · <strong>AROOOO</strong> ⚡🐺
        </p>
      </div>
    </div>
  );
}
