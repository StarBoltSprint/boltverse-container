import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { isOnboardingDone } from "../data/contentStore";
import { usePlatform } from "../platform/PlatformContext";

type Mode = "pick" | "x" | "local";

export function Auth() {
  const { platform } = usePlatform();
  const { isLoggedIn, connectWithX, signUpLocal } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("pick");
  const [xHandle, setXHandle] = useState("");
  const [xDisplay, setXDisplay] = useState("");
  const [localName, setLocalName] = useState("");
  const [avatar, setAvatar] = useState("🐺");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!platform) {
    return <Navigate to="/choose" replace />;
  }

  if (isLoggedIn) {
    return <Navigate to={isOnboardingDone() ? "/" : "/onboarding"} replace />;
  }

  function afterAuth() {
    navigate(isOnboardingDone() ? "/" : "/onboarding", { replace: true });
  }

  function onConnectX(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    // Static GitHub Pages cannot complete real X OAuth without a backend.
    // We link an X handle as session identity (demo / client-side).
    window.setTimeout(() => {
      try {
        connectWithX(xHandle, xDisplay || undefined);
        afterAuth();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not connect");
        setBusy(false);
      }
    }, 600);
  }

  function onCreateLocal(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!localName.trim()) {
      setError("Choose a Pack name");
      return;
    }
    signUpLocal(localName, avatar);
    afterAuth();
  }

  return (
    <div className="platform-gate auth-gate">
      <div className="platform-gate-bg" aria-hidden />
      <div className="platform-gate-card auth-card">
        <div className="platform-gate-brand">
          <span className="platform-gate-mark" aria-hidden>
            ⚡
          </span>
          <div>
            <h1>Join the Pack</h1>
            <p>Sign in · Boltverse Citadel</p>
          </div>
        </div>

        {mode === "pick" && (
          <>
            <h2 className="platform-gate-title">Connect or create</h2>
            <p className="platform-gate-sub">
              Link an X handle, or create a local Pack name. Your profile stays on this device for
              now (GitHub Pages demo — full X OAuth needs a backend later).
            </p>

            <div className="auth-pick">
              <button type="button" className="auth-method-card auth-x" onClick={() => setMode("x")}>
                <span className="auth-method-icon">𝕏</span>
                <span className="auth-method-label">Connect with X</span>
                <span className="auth-method-blurb">
                  Use your X username as Pack identity (@handle)
                </span>
                <span className="platform-card-cta">Continue →</span>
              </button>

              <button
                type="button"
                className="auth-method-card auth-local"
                onClick={() => setMode("local")}
              >
                <span className="auth-method-icon">🐺</span>
                <span className="auth-method-label">Create Pack name</span>
                <span className="auth-method-blurb">
                  No X needed — pick a name and enter the Citadel
                </span>
                <span className="platform-card-cta">Continue →</span>
              </button>
            </div>
          </>
        )}

        {mode === "x" && (
          <form className="auth-form" onSubmit={onConnectX}>
            <h2 className="platform-gate-title">Connect with X</h2>
            <p className="platform-gate-sub">
              Enter the handle you want linked. This is a <strong>client-side link</strong> (no OAuth
              redirect on this static host). Opens X profile in a new tab for convenience.
            </p>

            <label className="field">
              <span>X handle</span>
              <input
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
                placeholder="@StarBoltSprint"
                autoComplete="username"
                autoFocus
                required
              />
            </label>

            <label className="field">
              <span>Display name (optional)</span>
              <input
                value={xDisplay}
                onChange={(e) => setXDisplay(e.target.value)}
                placeholder="How you appear in the Pack"
                maxLength={32}
              />
            </label>

            {error && <div className="auth-error">{error}</div>}

            <div className="onboarding-actions">
              <button type="button" className="btn-ghost" onClick={() => setMode("pick")}>
                Back
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  const h = xHandle.trim().replace(/^@/, "");
                  if (h) window.open(`https://x.com/${h}`, "_blank", "noopener,noreferrer");
                }}
              >
                Open X
              </button>
              <button type="submit" className="btn-play" disabled={busy}>
                {busy ? "Connecting…" : "Connect handle"}
              </button>
            </div>
          </form>
        )}

        {mode === "local" && (
          <form className="auth-form" onSubmit={onCreateLocal}>
            <h2 className="platform-gate-title">Create Pack name</h2>
            <p className="platform-gate-sub">
              Local account on this browser. Used on publishes, Pack leaderboard, and Codex.
            </p>

            <label className="field">
              <span>Pack name</span>
              <input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="e.g. Thunder Pup"
                maxLength={24}
                autoFocus
                required
              />
            </label>

            <div className="field">
              <span>Avatar</span>
              <div className="emoji-row">
                {["🐺", "⚡", "🐾", "💎", "🌀", "✨", "🔥", "🏰"].map((e) => (
                  <button
                    key={e}
                    type="button"
                    className={`emoji-pick${avatar === e ? " on" : ""}`}
                    onClick={() => setAvatar(e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="onboarding-actions">
              <button type="button" className="btn-ghost" onClick={() => setMode("pick")}>
                Back
              </button>
              <button type="submit" className="btn-play">
                Create account
              </button>
            </div>
          </form>
        )}

        <p className="platform-gate-foot">
          Powered by xAI & YOU · <strong>AROOOO</strong> ⚡🐺
        </p>
      </div>
    </div>
  );
}
