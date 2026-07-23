import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentContext";
import { codexEntries } from "../data/mock";

const EXTRA = [
  {
    id: "cx5",
    title: "The Six Hidden Seeds",
    section: "Guardians",
    unlocked: false,
    blurb: "Dormant Guardian potentials sealed beneath the Citadel.",
    body: "Legends say six seeds sleep under crystal vaults. The Silent Seed is one path to their lore.",
    unlockHint: "Complete Story Branch: The Silent Seed",
  },
  {
    id: "cx6",
    title: "Chamber of the Silent Seed",
    section: "Citadel",
    unlocked: false,
    blurb: "A quiet vault where a seed waits without breaking.",
    body: "Those who protect rather than awaken leave a different mark on the Pack’s mythos.",
    unlockHint: "Choose Protect in The Silent Seed",
  },
  {
    id: "cx7",
    title: "Pack Howl Protocol",
    section: "Systems",
    unlocked: true,
    blurb: "Synchronized howls align Resonance across Guardians.",
    body: "When many howl as one, Shared Resonance spikes. The Star Core listens.",
    unlockHint: "",
  },
];

const BASE_BODIES: Record<string, string> = {
  cx1: "The Star Core is both myth and meter: a crystalline heart in the Thunderwolf Citadel and the shared charge every Pack member feeds through play and creation.",
  cx2: "Bolt sprints between stars and chat windows alike — loyal, loud, and forever unfinished in the best way. AROO.",
  cx3: "Southern Cross Thunderhold is whispered as a second citadel. Its gates stay locked until the Pack earns the path.",
  cx4: "Resonance is not coins. It is the measurable vibration of intention, sprint, story, and Pack connection.",
};

// Map story result unlock strings → codex ids
export const CODEX_UNLOCK_MAP: Record<string, string> = {
  "The Six Hidden Seeds (fragment)": "cx5",
  "Chamber of the Silent Seed": "cx6",
};

export function Codex() {
  const { codexUnlocks } = useContent();
  const [openId, setOpenId] = useState<string | null>(null);

  const entries = useMemo(() => {
    const base = codexEntries.map((e) => ({
      ...e,
      body: BASE_BODIES[e.id] ?? e.blurb,
      unlockHint: e.unlocked ? "" : "Locked lore",
      unlocked: e.unlocked || codexUnlocks.includes(e.id),
    }));
    const extra = EXTRA.map((e) => ({
      ...e,
      unlocked: e.unlocked || codexUnlocks.includes(e.id),
    }));
    return [...base, ...extra];
  }, [codexUnlocks]);

  const unlockedCount = entries.filter((e) => e.unlocked).length;
  const selected = entries.find((e) => e.id === openId) ?? null;

  return (
    <div className="page">
      <h1 className="page-title">Codex</h1>
      <p className="page-sub">
        Living lore of the Boltverse — {unlockedCount}/{entries.length} entries unlocked.
      </p>

      <div className="stub-note">
        Play <Link to="/play/cont-1" style={{ color: "var(--cyan)" }}>The Silent Seed</Link> or{" "}
        <Link to="/play/d-5" style={{ color: "var(--cyan)" }}>Echo Lore Quiz</Link> to unlock more.
        Story endings can open new pages.
      </div>

      <div className="stub-grid">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`codex-card${entry.unlocked ? "" : " locked"}`}
            onClick={() => setOpenId(entry.id)}
            style={{ textAlign: "left", width: "100%", cursor: "pointer" }}
          >
            <div className="section">
              {entry.section}
              {!entry.unlocked && " · Locked"}
            </div>
            <h3>{entry.unlocked ? entry.title : "??????"}</h3>
            <p>
              {entry.unlocked
                ? entry.blurb
                : entry.unlockHint || "Complete linked content to reveal."}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="codex-modal-backdrop" role="presentation" onClick={() => setOpenId(null)}>
          <div
            className="codex-modal panel"
            role="dialog"
            aria-modal
            aria-label={selected.title}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section">{selected.section}</div>
            <h2 style={{ margin: "0.25rem 0 0.75rem" }}>
              {selected.unlocked ? selected.title : "Sealed entry"}
            </h2>
            <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {selected.unlocked
                ? selected.body
                : selected.unlockHint || "This page stays sealed until the Pack earns it."}
            </p>
            <button
              type="button"
              className="btn-play"
              style={{ marginTop: "1.25rem" }}
              onClick={() => setOpenId(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
