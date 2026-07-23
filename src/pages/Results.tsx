import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useContent } from "../content/ContentContext";
import type { PlayResult } from "../data/playContent";
import { loadPlayResult } from "../data/playSession";
import { typeLabel } from "../data/mock";
import { CODEX_UNLOCK_MAP } from "./Codex";

export function Results() {
  const { id = "" } = useParams();
  const location = useLocation();
  const fromState = location.state as PlayResult | null;
  const { findExperience, unlockCodex } = useContent();

  const result = useMemo(() => {
    if (fromState?.experienceId) return fromState;
    return loadPlayResult(id);
  }, [fromState, id]);

  const exp = findExperience(id);

  useEffect(() => {
    if (!result?.codexUnlock) return;
    const mapped = CODEX_UNLOCK_MAP[result.codexUnlock];
    if (mapped) unlockCodex(mapped);
  }, [result, unlockCodex]);

  if (!result) {
    return (
      <div className="page">
        <div className="stub-note">No results for this run. Play an experience first.</div>
        <div className="stack" style={{ maxWidth: 360 }}>
          <Link to={`/play/${id || "feat-1"}`} className="btn-play" style={{ textAlign: "center" }}>
            Play sample
          </Link>
          <Link to="/discover" className="btn-ghost">
            Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page results-page">
      <div className="results-hero">
        <div className="results-emoji" aria-hidden>
          {result.emoji}
        </div>
        <p className="core-caption">Run complete</p>
        <h1 className="page-title" style={{ marginBottom: "0.35rem" }}>
          {result.endingTitle ?? "Complete"}
        </h1>
        <p className="page-sub" style={{ marginBottom: "0.5rem" }}>
          {result.title} · {typeLabel(result.type)}
        </p>
        <p className="results-summary">{result.endingSummary}</p>
      </div>

      <div className="results-grid">
        <div className="panel results-stat">
          <span className="panel-title">Personal Resonance</span>
          <strong className="results-num">+{result.personalResonance}</strong>
        </div>
        <div className="panel results-stat">
          <span className="panel-title">Shared → Star Core</span>
          <strong className="results-num">+{result.sharedResonance}</strong>
        </div>
        <div className="panel results-stat">
          <span className="panel-title">Core charge</span>
          <strong className="results-num cyan">{result.coreDelta}</strong>
        </div>
      </div>

      {result.codexUnlock && (
        <div className="panel" style={{ marginTop: "1rem" }}>
          <h2 className="panel-title">Codex unlock</h2>
          <p style={{ margin: 0, color: "var(--cyan)" }}>📜 {result.codexUnlock}</p>
          <Link to="/codex" className="btn-ghost" style={{ marginTop: "0.75rem", display: "inline-flex" }}>
            Open Codex
          </Link>
        </div>
      )}

      <div className="panel" style={{ marginTop: "1rem" }}>
        <h2 className="panel-title">Rewards</h2>
        <ul className="results-rewards">
          {result.rewards.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      {result.choicePath && result.choicePath.length > 0 && (
        <div className="panel" style={{ marginTop: "1rem" }}>
          <h2 className="panel-title">Your path</h2>
          <p className="page-sub" style={{ margin: 0 }}>
            {result.choicePath.join(" → ")}
          </p>
        </div>
      )}

      <div className="results-actions">
        <Link to={`/play/${result.experienceId}`} className="btn-play">
          Play again
        </Link>
        <Link to="/discover" className="btn-ghost">
          Discover more
        </Link>
        <Link to="/" className="btn-ghost">
          Home
        </Link>
        {(exp?.type === "story-branch" || result.codexUnlock) && (
          <Link to="/codex" className="btn-ghost">
            Open Codex
          </Link>
        )}
      </div>

      <p className="footer-howl">
        Powered by xAI & YOU · <strong>AROOOO</strong> ⚡🐺
      </p>
    </div>
  );
}
