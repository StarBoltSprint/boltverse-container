import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useContent } from "../content/ContentContext";
import { STAR_CORE_CHARGE } from "../data/mock";

const LEADERBOARD = [
  { name: "Forge Hero · SmiR", resonance: 48200, title: "Thread Keeper" },
  { name: "Lore Weaver · Ara", resonance: 39100, title: "Seed Singer" },
  { name: "Portal Pack", resonance: 28850, title: "Rift Closer" },
  { name: "Codex Keepers", resonance: 22100, title: "Memory Wardens" },
];

const GOALS = [
  { label: "Complete 50,000 Mini-Quests together", progress: 62 },
  { label: "Publish 1,000 Story Branches this week", progress: 28 },
  { label: "Pack Howls this session (local mock)", progress: 0, dynamic: true },
];

export function Pack() {
  const { displayName, howlCount, doHowl, published } = useContent();
  const { user } = useAuth();
  const [howling, setHowling] = useState(false);
  const [lastHowl, setLastHowl] = useState<string | null>(null);

  function startHowl() {
    setHowling(true);
    window.setTimeout(() => {
      const n = doHowl();
      setHowling(false);
      setLastHowl(`Howl #${n} sent · mock Shared Resonance +12 to the Star Core`);
    }, 1200);
  }

  const board = [
    {
      name: `${displayName} (you)`,
      resonance: 12840 + howlCount * 12 + published.length * 80,
      title: "Pack Guardian",
    },
    ...LEADERBOARD,
  ].sort((a, b) => b.resonance - a.resonance);

  return (
    <div className="page">
      <h1 className="page-title">Pack</h1>
      <p className="page-sub">
        Howls, shared goals, leaderboards — the collective pulse of the Citadel.
      </p>

      {lastHowl && (
        <div className="success-banner" role="status">
          {lastHowl}
        </div>
      )}

      <div className="home-grid">
        <section className={`panel core-hero pack-howl${howling ? " howling" : ""}`} style={{ minHeight: 220 }}>
          <p className="core-caption">Pack Howl</p>
          <div style={{ fontSize: "3rem" }} aria-hidden>
            🐺
          </div>
          <p>
            Join a synchronized Howl. Local mock for now — each howl still feels like charging the
            Core with the Pack.
          </p>
          <p className="play-foot" style={{ marginTop: "0.35rem" }}>
            Your howls: <strong style={{ color: "var(--cyan)" }}>{howlCount}</strong> · Star Core
            mock {STAR_CORE_CHARGE}%
          </p>
          <button
            type="button"
            className="btn-play"
            style={{ marginTop: "0.75rem" }}
            onClick={startHowl}
            disabled={howling}
          >
            {howling ? "Howling…" : "Start Howl"}
          </button>
        </section>

        <section className="panel">
          <h2 className="panel-title">Shared goals</h2>
          {GOALS.map((g) => {
            const pct =
              g.dynamic ? Math.min(100, howlCount * 10) : g.progress;
            return (
              <div key={g.label} className="challenge-row">
                <div className="challenge-head">
                  <strong>{g.label}</strong>
                  <span>{pct}%</span>
                </div>
                <div className="bar" aria-hidden>
                  <i style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <section className="panel" style={{ marginTop: "1.25rem" }}>
        <h2 className="panel-title">Leaderboard (mock)</h2>
        <div className="stack">
          {board.map((row, i) => (
            <div key={row.name} className="leader-row">
              <span className="leader-rank">#{i + 1}</span>
              <div className="leader-meta">
                <strong>{row.name}</strong>
                <span>{row.title}</span>
              </div>
              <span className="leader-score">{row.resonance.toLocaleString()} ⚡</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginTop: "1.25rem" }}>
        <h2 className="panel-title">Pack notes</h2>
        <ul className="results-rewards">
          <li>
            You are signed in as <strong>{displayName}</strong>
            {user?.method === "x" && user.xHandle
              ? ` (X @${user.xHandle})`
              : " (local Pack name)"}
            .
          </li>
          <li>Published creations: {published.length}</li>
          <li>
            Live multiplayer Howls need the shared backend later — this tab is the full light Pack
            loop for demos.
          </li>
        </ul>
        <div className="results-actions" style={{ marginTop: "0.75rem" }}>
          <Link to="/discover" className="btn-ghost">
            Discover
          </Link>
          <Link to="/create" className="btn-ghost">
            Create
          </Link>
        </div>
      </section>
    </div>
  );
}
